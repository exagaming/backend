import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { PAYMENT_METHODS } from '@src/utils/constants/game.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    userId: { type: 'string' },
    gameId: { type: 'string' },
    amount: { type: 'number' },
    currencyId: { type: 'string' },
    specialRemark: { type: 'string' }
  },
  required: ['betId', 'userId', 'gameId', 'currencyId', 'amount']
})

export class CreateDebitTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: { Transaction: TransactionModel },
      sequelizeTransaction
    } = this.context

    const { betId, userId, gameId, currencyId, amount, specialRemark } = this.args

    try {
      const existingTransaction = await TransactionModel.findOne({
        attributes: ['id'],
        where: {
          betId,
          gameId,
          userId,
          currencyId,
          transactionType: TRANSACTION_TYPES.BET,
          comments: specialRemark ?? null
        }
      })

      if (existingTransaction) {
        if (existingTransaction.status === TRANSACTION_STATUS.PENDING) return existingTransaction
        else if (existingTransaction.status === TRANSACTION_STATUS.FAILED) throw messages.BLOCKED_TRANSACTION
        else if (existingTransaction.status === TRANSACTION_STATUS.SUCCESS) throw messages.TRANSACTION_ALREADY_PROCESSED
      }

      const transaction = await TransactionModel.create({
        userId,
        amount,
        betId,
        gameId,
        currencyId,
        status: TRANSACTION_STATUS.SUCCESS,
        paymentMethod: PAYMENT_METHODS.GAME,
        transactionType: TRANSACTION_TYPES.BET,
        comments: specialRemark ?? null
      }, { transaction: sequelizeTransaction })

      return transaction
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
