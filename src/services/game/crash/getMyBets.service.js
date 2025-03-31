import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT } from '@src/utils/constants/game.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    currencyId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['userId', 'gameId', 'currencyId']
})

export class GetMyBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, userId, gameId, currencyId } = this.args

    try {
      const bets = await this.context.dbModels.CrashGameBet.findAndCountAll({
        where: {
          userId,
          currencyId,
          result: [BET_RESULT.WON, BET_RESULT.LOST]
        },
        include: [{
          model: this.context.dbModels.CrashGameRoundDetail,
          where: { gameId },
          as: 'roundDetail'
        }, {
          model: this.context.dbModels.User,
          as: 'user'
        }],
        raw: true,
        nest: true,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']]
      })

      return { page, bets: bets.rows, totalPages: Math.ceil(bets.count / perPage) }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
