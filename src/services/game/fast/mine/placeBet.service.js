import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { mineGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { MINE_MAX_TILE_COUNT, MINE_MIN_TILE_COUNT } from '@src/utils/constants/mine.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    userId: { type: 'string' },
    userCode: { type: 'string' },
    betAmount: { type: 'number' },
    clientSeed: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    mineCount: { type: 'number', minimum: MINE_MIN_TILE_COUNT, maximum: MINE_MAX_TILE_COUNT, default: MINE_MIN_TILE_COUNT }
  },
  required: ['mineCount', 'clientSeed', 'betAmount', 'gameId', 'currencyId', 'currencyCode', 'operatorId', 'operatorUserToken', 'userId', 'userCode']
})

export class PlaceBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: { MineGameBet: MineGameBetModel },
        sequelizeTransaction
      },
      args: { mineCount, betAmount, clientSeed, currencyId, operatorId, userId, currencyCode, gameId, operatorUserToken, userCode }
    } = this

    try {
      if (mineCount < MINE_MIN_TILE_COUNT || mineCount > MINE_MAX_TILE_COUNT) throw messages.INVALID_MINE_COUNT
      console.log("PLACE INTO", gameId)
      const previousRoundBet = await MineGameBetModel.findOne({
        where: {gameId, userId, result: BET_RESULT.PENDING },
        attributes: { exclude: ['mineTiles', 'serverSeed', 'clientSeed'] },
        transaction: sequelizeTransaction
      })
      if (previousRoundBet) return previousRoundBet

      const gameSettings = await GameSettingsService.run({ gameId, operatorId, currencyCode, includes: false }, this.context)

      if (betAmount < gameSettings.minBet) throw messages.BET_AMOUNT_BELOW_MIN_RANGE
      if (betAmount > gameSettings.maxBet) throw messages.BET_AMOUNT_EXCEEDS_MAX_RANGE

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)
      const mineTiles = mineGameResult(clientSeed, serverSeed, mineCount, MINE_MAX_TILE_COUNT)

      const bet = await MineGameBetModel.create({
        userId,
        mineCount,
        mineTiles,
        betAmount,
        gameId,
        currencyId,
        clientSeed,
        serverSeed,
        currentGameSettings: gameSettings
      }, { transaction: sequelizeTransaction })

      const { response: debitResponse } = await DebitService.run({
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
      } else {
        bet.winningAmount = 0
        bet.result = BET_RESULT.CANCELLED
        await bet.save({ transaction: sequelizeTransaction })
      }

      delete bet.dataValues.serverSeed
      delete bet.dataValues.clientSeed
      delete bet.dataValues.mineTiles

      return { bet, nextServerSeedHash }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
