import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { mineGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { MINE_MAX_TILE_COUNT, MINE_MIN_TILE_COUNT } from '@src/utils/constants/mine.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { calculateMineGameOdd } from '@src/utils/mine.utils'
import { minus, plus, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    mineCount: { type: 'number' },
    betAmount: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    clientSeed: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    tiles: { type: 'array', uniqueItems: true, minItems: 1, items: { type: 'number', minimum: MINE_MIN_TILE_COUNT, maximum: MINE_MAX_TILE_COUNT } }
  },
  required: ['mineCount', 'clientSeed', 'betAmount', 'tiles', 'currencyId', 'operatorId', 'userId', 'operatorUserToken', 'currencyCode', 'gameId', 'userCode']
})

export class PlaceAutoBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: { sequelizeTransaction },
      args: { mineCount, betAmount, clientSeed, tiles, currencyId, operatorId, currencyCode, operatorUserToken, userCode, userId, gameId }
    } = this

    try {
      const gameSettings = await GameSettingsService.run({ gameId, operatorId, currencyCode, includes: false }, this.context)

      if (betAmount < gameSettings.minBet) throw messages.BET_AMOUNT_BELOW_MIN_RANGE
      if (betAmount > gameSettings.maxBet) throw messages.BET_AMOUNT_EXCEEDS_MAX_RANGE

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)
      const mineTiles = mineGameResult(clientSeed, serverSeed, mineCount, MINE_MAX_TILE_COUNT)

      let winningAmount = 0
      let result = BET_RESULT.LOST

      const atLeastOneMineDetected = tiles.some((tile) => mineTiles.includes(tile))
      if (!atLeastOneMineDetected) {
        const odds = calculateMineGameOdd(mineTiles.length, tiles.length, gameSettings.minOdds, gameSettings.maxOdds, gameSettings.houseEdge)
        const profit = minus(times(odds, betAmount), betAmount)

        winningAmount = plus(betAmount, Math.min(profit, gameSettings.maxProfit))
        result = BET_RESULT.WON
      }

      const bet = await this.context.dbModels.MineGameBet.create({
        userId,
        result,
        mineCount,
        mineTiles,
        betAmount,
        gameId,
        currencyId,
        clientSeed,
        serverSeed,
        winningAmount,
        openTiles: tiles,
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
