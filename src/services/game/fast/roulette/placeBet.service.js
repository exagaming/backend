import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { rouletteGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { ROULETTE_BET_TYPES, ROULETTE_RULES } from '@src/utils/constants/roulette.constants'
import { minus, plus, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    betDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          betNumber: { type: 'number' },
          betType: { enum: Object.values(ROULETTE_BET_TYPES) }
        },
        required: ['amount', 'betType', 'betNumber']
      }
    },
    gameId: { type: 'string' },
    userId: { type: 'string' },
    userCode: { type: 'string' },
    clientSeed: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['betDetails', 'clientSeed', 'operatorId', 'currencyCode', 'userId', 'currencyId', 'gameId', 'userCode', 'operatorUserToken']
})

export class PlaceBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: { sequelizeTransaction },
      args: { betDetails, clientSeed, operatorId, currencyCode, userId, currencyId, gameId, userCode, operatorUserToken }
    } = this

    try {
      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId, includes: false }, this.context)

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)
      const winningNumber = rouletteGameResult(clientSeed, serverSeed)

      let { winningAmount, betAmount } = betDetails.reduce((prev, betDetail) => {
        const rouletteRule = ROULETTE_RULES[betDetail.betType]

        if (!rouletteRule) throw messages.INVALID_BET_DETAILS
        if (betDetail.betType === ROULETTE_BET_TYPES.STRAIGHT) rouletteRule.winningNumbers[betDetail.betNumber] = [betDetail.betNumber]

        prev.betAmount = plus(prev.betAmount, betDetail.amount)
        if (rouletteRule.winningNumbers[betDetail.betNumber].includes(winningNumber)) {
          prev.winningAmount = plus(prev.winningAmount, times(betDetail.amount, rouletteRule.payout))
        }

        return prev
      }, { winningAmount: 0, betAmount: 0 })

      if (betAmount < gameSettings.minBet) throw messages.BET_AMOUNT_BELOW_MIN_RANGE
      if (betAmount > gameSettings.maxBet) throw messages.BET_AMOUNT_EXCEEDS_MAX_RANGE

      let result = BET_RESULT.LOST
      if (winningAmount > 0) {
        result = BET_RESULT.WON
        const profit = minus(winningAmount, betAmount)
        if (profit > gameSettings.maxProfit) winningAmount = plus(betAmount, gameSettings.maxProfit)
      }

      const bet = await this.context.dbModels.RouletteGameBet.create({
        result,
        userId,
        betAmount,
        betDetails,
        currencyId,
        clientSeed,
        serverSeed,
        winningNumber,
        winningAmount,
        currentGameSettings: gameSettings
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
        } catch {
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
