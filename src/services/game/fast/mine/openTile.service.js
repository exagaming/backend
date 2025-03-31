import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { MINE_MAX_TILE_COUNT, MINE_MIN_TILE_COUNT } from '@src/utils/constants/mine.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    tile: { type: 'number', minimum: MINE_MIN_TILE_COUNT, maximum: MINE_MAX_TILE_COUNT }
  },
  required: ['tile', 'operatorUserToken', 'userId', 'operatorId', 'currencyCode', 'userCode', 'currencyId']
})

export class OpenTileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tile = parseInt(this.args.tile)

    const {
      dbModels: {
        MineGameBet: MineGameBetModel,
        Transaction: TransactionModel
      },
      sequelizeTransaction
    } = this.context

    const {
      operatorId,
      userId,
      currencyId,
      currencyCode,
      gameId,
      operatorUserToken,
      userCode
    } = this.args

    // This is the "gameId" passed in from the context/auth,
    // matching MineGameBet's "gameId" attribute => "game_id" column
    const resolvedGameId = this.context.auth?.gameId || gameId

    try {
      const bet = await MineGameBetModel.findOne({
        attributes: { exclude: ['currentGameSettings', 'createdAt', 'updatedAt'] },
        where: {
          // Make sure you're using "gameId" not "MineGameBet.gameId" at raw SQL level
          gameId: resolvedGameId,
          userId,
          currencyId,
          result: BET_RESULT.PENDING
        },
        include: {
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
      if (bet.openTiles.includes(tile)) throw messages.MINE_TILE_ALREADY_OPENED

      bet.openTiles.push(tile)
      bet.changed('openTiles', true)

      // If the opened tile is a mine => user loses
      if (bet.mineTiles.includes(tile)) {
        bet.result = BET_RESULT.LOST
        bet.winningAmount = 0

        // Call your credit rollback/adjustment
        const { response: creditResponse } = await CreditService.run({
          userId,
          gameId: resolvedGameId,
          userCode,
          operatorId,
          currencyId,
          currencyCode,
          betId: bet.id,
          roundId: bet.id,
          operatorUserToken,
          amount: bet.winningAmount, // zero
          debitTransactionId: bet.betTransaction.transactionId
        }, this.context)

        // If operator's credit call is successful => emit updated wallet
        if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
          WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
        }
      }

      await bet.save({ transaction: sequelizeTransaction })

      return bet.result === BET_RESULT.LOST
        ? { mineTile: true, bet }
        : { mineTile: false }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
