import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { RollbackService } from '@src/services/operator-callback/rollback.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'operatorUserToken', 'operatorId', 'gameId', 'userCode', 'currencyId', 'currencyCode']
})

export class CancelBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      dbModels: {
        MineGameBet: MineGameBetModel,
        Transaction: TransactionModel
      },
      sequelizeTransaction
    } = this.context

    const { userId, operatorUserToken, operatorId, gameId, userCode, currencyId, currencyCode } = this.args

    try {
      const bet = await MineGameBetModel.findOne({
        where: { userId, currencyId, result: BET_RESULT.PENDING },
        include: {
          attributes: ['transactionId'],
          model: TransactionModel,
          as: 'betTransaction',
          required: true
        },
        lock: {
          of: MineGameBetModel,
          level: sequelizeTransaction.LOCK.UPDATE
        },
        transaction: sequelizeTransaction
      })
      if (!bet) throw messages.NO_PLACED_BET_FOUND
      if (bet.openTiles.length) throw messages.MINE_TILE_ALREADY_OPENED

      const { response: rollbackResponse } = await RollbackService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        roundId: bet.id,
        operatorUserToken,
        amount: bet.betAmount,
        debitTransactionId: bet.betTransaction.transactionId
      }, this.context)

      bet.result = BET_RESULT.CANCELLED
      await bet.save({ transaction: sequelizeTransaction })

      if (rollbackResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, rollbackResponse.wallet)
      }

      return bet
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
