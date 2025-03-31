import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { plinkoGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { PLINKO_BALLS, PLINKO_FIXED_ODDS, PLINKO_RISK_LEVELS, PLINKO_ROWS } from '@src/utils/constants/plinko.constants'
import { getPrecision } from '@src/utils/math.utils'
import _ from 'lodash'
import { divide, minus, plus, round, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    betAmount: { type: 'number' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    clientSeed: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    riskLevel: { enum: Object.values(PLINKO_RISK_LEVELS), default: PLINKO_RISK_LEVELS.LOW },
    numberOfRows: { type: 'number', minimum: PLINKO_ROWS.MINIMUM, maximum: PLINKO_ROWS.MAXIMUM, default: PLINKO_ROWS.MINIMUM },
    numberOfBalls: { type: 'number', minimum: PLINKO_BALLS.MINIMUM, maximum: PLINKO_BALLS.MAXIMUM, default: PLINKO_BALLS.MINIMUM }
  },
  required: ['numberOfRows', 'riskLevel', 'clientSeed', 'betAmount', 'numberOfBalls', 'userId', 'operatorId', 'currencyCode', 'currencyId', 'operatorUserToken', 'gameId']
})

export class PlaceBetService extends ServiceBase {
  get constrains () {
    return constraints
  }

  async run () {
    const {
      context: { sequelizeTransaction },
      args: { riskLevel, numberOfRows, userCode, betAmount, clientSeed, numberOfBalls, userId, currencyCode, currencyId, operatorUserToken, operatorId, gameId }
    } = this

    try {
      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId, includes: false }, this.context)
      if (betAmount < gameSettings.minBet) throw messages.BET_AMOUNT_BELOW_MIN_RANGE
      if (betAmount > gameSettings.maxBet) throw messages.BET_AMOUNT_EXCEEDS_MAX_RANGE

      let totalWinningAmount = 0
      const winningSlots = []
      const dropDetails = []
      const selectedOdds = PLINKO_FIXED_ODDS[numberOfRows][(riskLevel === 4 ? 2 : riskLevel - 1)]
      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      for (let currentBall = 1; currentBall <= numberOfBalls; currentBall++) {
        const result = plinkoGameResult(clientSeed.concat(`-${currentBall}`), serverSeed, numberOfRows)
        const totalCountOfOneChar = _.reduce(result, (count, char) => char === '1' ? ++count : count, 0)

        // INFO: Actual odds are calculated based on houseEdge using fixed odds
        // INFO: And if odd is greater then 10, need to increase the value by 1, because below formula won't work perfectly for values greater then 10
        // let actualOdd = Math.max(0.1, times(selectedOdds[totalCountOfOneChar], minus(1, divide(gameSettings.houseEdge, 100))))
        let actualOdd = Math.max(0.1, +getPrecision(times(selectedOdds[totalCountOfOneChar], minus(1, divide(gameSettings.houseEdge, 100))), 1))
        actualOdd = actualOdd > 10 ? Math.floor(actualOdd) + 1 : actualOdd

        const winningAmount = round(times(betAmount, actualOdd), 2)
        const profit = minus(winningAmount, betAmount)
        const actualWinningAmount = profit > gameSettings.maxProfit ? round(plus(betAmount, gameSettings.maxProfit), 2) : winningAmount

        totalWinningAmount = round(plus(totalWinningAmount, actualWinningAmount), 2)

        dropDetails.push(result)
        winningSlots.push(totalCountOfOneChar)
      }

      const totalBetAmount = round(times(betAmount, numberOfBalls), 2)
      const bet = await this.context.dbModels.PlinkoGameBet.create({
        userId,
        riskLevel,
        currencyId,
        clientSeed,
        serverSeed,
        dropDetails,
        numberOfRows,
        winningSlots,
        numberOfBalls,
        betAmount: totalBetAmount,
        winningAmount: totalWinningAmount,
        currentGameSettings: gameSettings,
        result: totalWinningAmount > totalBetAmount ? BET_RESULT.WON : BET_RESULT.LOST
      }, { transaction: sequelizeTransaction })

      const { response: debitResponse, debitTransaction } = await DebitService.run({
        userId,
        gameId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        betId: bet.id,
        roundId: bet.id,
        operatorUserToken,
        amount: bet.betAmount
      }, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)
        try {
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
            debitTransactionId: debitTransaction.transactionId
          }, this.context)

          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
          }
        } catch (error) {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        }
      } else {
        bet.winningAmount = 0
        bet.result = BET_RESULT.CANCELLED
        await bet.save({ transaction: sequelizeTransaction })
      }

      return { bet, nextServerSeedHash }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
