import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { OperatorAxios } from '@src/libs/axios/operator.axios'
import ServiceBase from '@src/libs/serviceBase'
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    operatorId: { type: 'string' }
  },
  required: ['betId', 'operatorId']
})

export class TempRetryBetServices extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { betId, operatorId } = this.args

    try {
      const operator = await this.context.dbModels.Operator.findOne({ where: { id: operatorId }, raw: true })
      if (!operator) throw messages.INVALID_OPERATOR_ID

      const creditTransaction = await this.context.dbModels.Transaction.findOne({
        where: {
          betId,
          status: TRANSACTION_STATUS.FAILED,
          transactionType: TRANSACTION_TYPES.WIN
        },
        include: [{
          model: this.context.dbModels.Currency,
          as: 'currency'
        }, {
          model: this.context.dbModels.User,
          as: 'user'
        }, {
          model: this.context.dbModels.Game,
          as: 'game'
        }],
        raw: true,
        nest: true
      })
      if (!creditTransaction) throw messages.TRANSACTION_ALREADY_PROCESSED

      const response = await OperatorAxios.win(operator.callbackBaseUrl, operator.id, operator.operatorSecretKey, {
        betId,
        roundId: betId,
        amount: creditTransaction.amount,
        gameId: creditTransaction.game.id,
        gameName: creditTransaction.game.name,
        currencyId: creditTransaction.currency.id,
        currencyCode: creditTransaction.currency.code,
        transactionId: creditTransaction.transactionId,
        debitTransactionId: creditTransaction.debitTransactionId,
        user: {
          id: creditTransaction.user.userCode
        }
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
