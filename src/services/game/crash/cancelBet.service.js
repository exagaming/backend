import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { RollbackService } from '@src/services/operator-callback/rollback.service'
import { CrashGameEmitter } from '@src/socket-resources/emitters/crashGame.emitter'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT, CRASH_GAME_STATE } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betId: { type: 'string' },
    gameId: { type: 'string' },
    userId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'operatorId', 'gameId', 'userCode', 'betId', 'operatorUserToken']
})

export class CancelBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          Transaction: TransactionModel,
          CrashGameBet: CrashGameBetModel,
          CrashGameRoundDetail: CrashGameRoundDetailModel
        },
        sequelizeTransaction
      },
      args: { userId, operatorId, userCode, betId, gameId, operatorUserToken, currencyCode, currencyId }
    } = this

    try {
      const currentRound = await CrashGameRoundDetailModel.findOne({
        attributes: ['id', 'gameId', 'roundId', 'roundState'],
        where: { gameId, roundState: CRASH_GAME_STATE.STARTED },
        order: [['id', 'DESC']],
        transaction: sequelizeTransaction
      })
      if (!currentRound) throw messages.NO_RUNNING_ROUND_FOUND

      const bet = await CrashGameBetModel.findOne({
        where: {
          userId,
          gameId,
          id: betId,
          currencyId,
          roundId: currentRound.id,
          result: BET_RESULT.PENDING
        },
        include: {
          attributes: ['transactionId'],
          model: TransactionModel,
          as: 'betTransaction',
          required: true
        },
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: CrashGameBetModel
        },
        skipLocked: true,
        transaction: sequelizeTransaction
      })
      if (!bet) throw messages.NO_PLACED_BET_FOUND

      const { response } = await RollbackService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        operatorUserToken,
        roundId: bet.roundId,
        amount: bet.betAmount,
        debitTransactionId: bet.betTransaction.transactionId
      }, this.context)

      bet.result = BET_RESULT.CANCELLED
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
