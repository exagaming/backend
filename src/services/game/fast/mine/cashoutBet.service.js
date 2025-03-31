import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { calculateMineGameOdd } from '@src/utils/mine.utils'
import { minus, plus, round, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['currencyId', 'currencyCode', 'userCode', 'operatorUserToken', 'operatorId', 'userId', 'gameId']
})

export class CashoutBetService extends ServiceBase {
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

    const { currencyId, currencyCode, userCode, operatorUserToken, operatorId, userId, gameId } = this.args

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
          level: sequelizeTransaction.LOCK.UPDATE,
          of: MineGameBetModel
        },
        transaction: sequelizeTransaction
      })

      if (!bet) throw messages.NO_PLACED_BET_FOUND
      if (bet.openTiles.length === 0) throw messages.NO_OPEN_TILE_FOUND

      const gameSettings = bet.currentGameSettings
      const odds = calculateMineGameOdd(bet.mineTiles.length, bet.openTiles.length, gameSettings.minOdds, gameSettings.maxOdds, gameSettings.houseEdge)

      const profit = minus(times(odds, bet.betAmount), bet.betAmount)

      bet.result = BET_RESULT.WON
      bet.winningAmount = round(plus(bet.betAmount, Math.min(profit, gameSettings.maxProfit)), 2)

      await bet.save({ transaction: sequelizeTransaction })

      const { response: creditResponse } = await CreditService.run({
        userId,
        gameId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        roundId: bet.id,
        operatorUserToken,
        amount: bet.winningAmount,
        debitTransactionId: bet.betTransaction.transactionId
      }, this.context)

      if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
      }

      return bet
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
