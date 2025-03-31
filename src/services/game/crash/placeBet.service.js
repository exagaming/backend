import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { CrashGameEmitter } from '@src/socket-resources/emitters/crashGame.emitter'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT, CRASH_GAME_STATE, GAME_CATEGORY } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    betAmount: { type: 'number' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    isAutoCashout: { type: 'boolean' },
    operatorUserToken: { type: 'string' },
    autoRate: { type: 'number', default: 0 }
  },
  required: ['userId', 'operatorId', 'currencyCode', 'currencyId', 'userCode', 'isAutoCashout', 'betAmount', 'operatorUserToken', 'gameId']
})

export class PlaceBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: { sequelizeTransaction },
      args: { autoRate, isAutoCashout, betAmount, userId, userCode, operatorId, currencyCode, currencyId, gameId, operatorUserToken }
    } = this

    try {
      const currentRound = await this.context.dbModels.CrashGameRoundDetail.findOne({
        where: { gameId, roundState: CRASH_GAME_STATE.STARTED },
        include: {
          attributes: ['id'],
          model: this.context.dbModels.Game,
          as: 'game',
          where: { gameCategory: GAME_CATEGORY.CRASH_GAME },
          required: true
        },
        order: [['id', 'DESC']],
        transaction: sequelizeTransaction
      })
      if (!currentRound) throw messages.NO_RUNNING_ROUND_FOUND

      const gameSettings = currentRound.currentGameSettings
      if (betAmount < +gameSettings.minBet || betAmount > +gameSettings.maxBet) throw messages.BET_AMOUNT_NOT_IN_LIMIT
      if (isAutoCashout && (autoRate < +gameSettings.minAutoRate || autoRate < +gameSettings.minOdd || autoRate > +gameSettings.maxOdd)) throw messages.INVALID_AUTO_RATE

      const bet = await this.context.dbModels.CrashGameBet.create({
        userId,
        gameId,
        autoRate,
        betAmount,
        currencyId,
        isAutoCashout,
        roundId: currentRound.id
      }, { transaction: sequelizeTransaction })

      const { response } = await DebitService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        operatorUserToken,
        amount: betAmount,
        roundId: currentRound.id
      }, this.context)

      if (response.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, response.wallet)
      } else {
        bet.winningAmount = 0
        bet.result = BET_RESULT.CANCELLED
        await bet.save({ transaction: sequelizeTransaction })
      }

      const crashBet = await this.context.dbModels.CrashGameBet.findOne({
        where: {
          id: bet.id,
          userId,
          result: BET_RESULT.PENDING,
          roundId: currentRound.id
        },
        include: {
          model: this.context.dbModels.User,
          as: 'user',
          attributes: ['id', 'userCode', 'userName', 'firstName', 'lastName']
        },
        transaction: sequelizeTransaction
      })

      CrashGameEmitter.betsInfo(operatorId, gameId, crashBet)

      return bet
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
