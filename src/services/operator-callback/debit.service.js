import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { OperatorAxios } from '@src/libs/axios/operator.axios'
import ServiceBase from '@src/libs/serviceBase'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { CreateDebitTransactionService } from '@src/services/transaction/createDebitTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constants/app.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { RollbackService } from './rollback.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    userId: { type: 'string' },
    amount: { type: 'number' },
    gameId: { type: 'string' },
    roundId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'number' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    specialRemark: { type: 'string' }
  },
  required: ['userId', 'userCode', 'amount', 'operatorUserToken', 'currencyCode', 'betId', 'operatorId', 'gameId', 'roundId', 'currencyId']
})

export class DebitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { operatorId, betId, userId, currencyId, amount, gameId, specialRemark, roundId, userCode, currencyCode, operatorUserToken } = this.args

    try {
      const debitTransaction = await CreateDebitTransactionService.run({ betId, userId, gameId, amount, currencyId, specialRemark }, this.context)
      const { callbackBaseUrl, operatorSecretKey } = await OperatorDetailsService.run({ operatorId }, this.context)

      const response = await OperatorAxios.bet(callbackBaseUrl, operatorId, operatorSecretKey, {
        betId,
        gameId,
        amount,
        roundId,
        currencyId: this.args.currencyId,
        currencyCode: currencyCode,
        transactionId: debitTransaction.transactionId,
        user: { id: userCode, token: operatorUserToken }
      })

      if (response.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        response.wallet.type = 'DEBIT'
      } else {
        const message = String(response.message)

        await this.context.dbModels.Transaction.update({
          status: TRANSACTION_STATUS.FAILED,
          comments: message
        }, {
          where: { id: debitTransaction.id },
          transaction: this.context.sequelizeTransaction
        })

        await RollbackService.run({
          betId,
          gameId,
          amount,
          userId,
          roundId,
          userCode,
          currencyId,
          operatorId,
          currencyCode,
          operatorUserToken,
          reason: message,
          debitTransactionId: debitTransaction.transactionId
        }, this.context)
      }

      return { response, debitTransaction }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
