import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { OperatorAxios } from '@src/libs/axios/operator.axios'
import ServiceBase from '@src/libs/serviceBase'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { CreateRollbackTransactionService } from '@src/services/transaction/createRollbackTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constants/app.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    gameId: { type: 'string' },
    amount: { type: 'number' },
    userId: { type: 'string' },
    reason: { type: 'string' },
    roundId: { type: 'string' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    debitTransactionId: { type: 'string' }
  },
  required: ['userCode', 'operatorUserToken', 'debitTransactionId', 'roundId', 'betId', 'operatorId']
})

export class RollbackService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { betId, userId, gameId, amount, currencyId, operatorId, debitTransactionId, roundId, reason } = this.args

    try {
      const rollbackTransaction = await CreateRollbackTransactionService.run({ betId, userId, gameId, amount, currencyId, debitTransactionId, reason }, this.context)
      const { callbackBaseUrl, operatorSecretKey } = await OperatorDetailsService.run({ operatorId }, this.context)

      const response = await OperatorAxios.rollback(callbackBaseUrl, operatorId, operatorSecretKey, {
        betId,
        gameId,
        amount,
        roundId,
        currencyId,
        currencyCode: this.args.currencyCode,
        originalTransactionId: debitTransactionId,
        rollbackTransactionId: rollbackTransaction.transactionId,
        user: { id: this.args.userCode, token: this.args.operatorUserToken }
      })

      if (response.status !== OPERATOR_RESPONSE_CODES.SUCCESS) {
        await this.context.dbModels.Transaction.update({
          status: TRANSACTION_STATUS.FAILED,
          comments: String(response.message)
        }, {
          where: { id: rollbackTransaction.id },
          transaction: this.context.sequelizeTransaction
        })
      }

      return { response, rollbackTransaction }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
