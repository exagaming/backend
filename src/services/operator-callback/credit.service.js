import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { OperatorAxios } from '@src/libs/axios/operator.axios'
import ServiceBase from '@src/libs/serviceBase'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { CreateCreditTransactionService } from '@src/services/transaction/createCreditTransaction.service'
import { TRANSACTION_STATUS } from '@src/utils/constants/app.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    gameId: { type: 'string' },
    userId: { type: 'string' },
    amount: { type: 'number' },
    roundId: { type: 'string' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    debitTransactionId: { type: 'string' },
    specialRemark: { type: 'string' }
  },
  required: ['userCode', 'amount', 'operatorUserToken', 'currencyCode', 'debitTransactionId', 'betId', 'operatorId', 'userId', 'gameId', 'roundId', 'currencyId']
})

export class CreditService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { operatorId, betId, userId, currencyId, amount, gameId, debitTransactionId, specialRemark } = this.args

    try {
      const creditTransaction = await CreateCreditTransactionService.run({ betId, gameId, userId, amount, currencyId, debitTransactionId, specialRemark }, this.context)
      const { callbackBaseUrl, operatorSecretKey } = await OperatorDetailsService.run({ operatorId }, this.context)

      const response = await OperatorAxios.win(callbackBaseUrl, operatorId, operatorSecretKey, {
        betId,
        gameId,
        amount,
        currencyId,
        roundId: this.args.roundId,
        currencyCode: this.args.currencyCode,
        transactionId: creditTransaction.transactionId,
        debitTransactionId: this.args.debitTransactionId,
        user: { id: this.args.userCode, token: this.args.operatorUserToken }
      })

      if (response.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        response.wallet.type = 'CREDIT'
        await this.context.dbModels.Transaction.update({
          status: TRANSACTION_STATUS.SUCCESS
        }, {
          where: { id: creditTransaction.id },
          transaction: this.context.sequelizeTransaction
        })
      } else {
        await this.context.dbModels.Transaction.update({
          status: TRANSACTION_STATUS.FAILED,
          comments: String(response.message)
        }, {
          where: { id: creditTransaction.id },
          transaction: this.context.sequelizeTransaction
        })
      }

      return { response, creditTransaction }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
