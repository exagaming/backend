import { ServiceError } from '@src/errors/service.error'
import { getMultiplierByGraphTime } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/day'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { CrashGameEmitter } from '@src/socket-resources/emitters/crashGame.emitter'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT, CRASH_GAME_STATE } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { minus, plus, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'userCode', 'operatorId', 'betId', 'gameId', 'operatorUserToken', 'currencyId', 'currencyCode']
})

export class PlayerEscapeService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          Transaction: TransactionModel,
          CrashGameBet: CrashGameBetModel,
          CrashGameRoundDetail: CrashGameRoundDetailModel,
          User: UserModel
        },
        reqTimeStamp,
        sequelizeTransaction
      },
      args: { betId, userId, userCode, operatorId, gameId, operatorUserToken, currencyId, currencyCode }
    } = this

    try {
      const currentRound = await CrashGameRoundDetailModel.findOne({
        attributes: ['id', 'gameId', 'roundId', 'roundState', 'currentGameSettings', 'onHoldAt'],
        where: { gameId, roundState: CRASH_GAME_STATE.ON_HOLD },
        order: [['id', 'DESC']],
        transaction: sequelizeTransaction
      })
      if (!currentRound) throw messages.NO_RUNNING_ROUND_FOUND

      const gameSettings = currentRound.currentGameSettings
      const bet = await CrashGameBetModel.findOne({
        where: {
          userId,
          id: betId,
          currencyId,
          roundId: currentRound.id,
          result: BET_RESULT.PENDING
        },
        include: [{
          attributes: ['transactionId'],
          model: TransactionModel,
          as: 'betTransaction',
          required: true
        }, {
          model: UserModel,
          as: 'user',
          attributes: ['id', 'userCode', 'userName', 'firstName', 'lastName']
        }],
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: CrashGameBetModel
        },
        skipLocked: true,
        transaction: sequelizeTransaction
      })
      if (!bet) throw messages.NO_PLACED_BET_FOUND

      // INFO: Calculate multiplier with request timestamp to get the exact escaped multiplier.
      const escapeTime = dayjs(reqTimeStamp)
      const roundHoldTime = dayjs(currentRound.onHoldAt)
      const multiplier = getMultiplierByGraphTime(gameSettings.minOdds, gameSettings.maxOdds, escapeTime.diff(roundHoldTime) / 1000)

      // INFO: If calculated multiplier is greater then the generated multiplier for that round, then the given information is wrong
      if (multiplier > +currentRound.crashRate) throw messages.NO_RUNNING_ROUND_FOUND

      // INFO: If profit exceeds maximum profit, give only maximum profit.
      bet.winningAmount = minus(bet.winningAmount, bet.betAmount) > gameSettings.maxProfit ? plus(bet.betAmount, gameSettings.maxProfit) : times(multiplier, bet.betAmount)
      bet.escapeRate = multiplier
      bet.result = BET_RESULT.WON

      const { response } = await CreditService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        operatorUserToken,
        roundId: bet.roundId,
        amount: bet.winningAmount,
        debitTransactionId: bet.betTransaction.transactionId
      }, this.context)

      await bet.save({ transaction: sequelizeTransaction })
      CrashGameEmitter.betsInfo(operatorId, gameId, bet)

      if (response.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, response.wallet)
      }

      return bet
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
