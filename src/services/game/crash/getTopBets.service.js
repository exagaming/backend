import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT, CRASH_GAME_STATE } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    currencyId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    orderBy: { enum: ['winningAmount', 'escapeRate'], default: 'winningAmount' }
  },
  required: ['gameId', 'currencyId']
})

export class GetTopBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, currencyId, gameId } = this.args

    try {
      const bets = await this.context.dbModels.CrashGameBet.findAndCountAll({
        where: {
          currencyId,
          gameId,
          result: { [Op.eq]: BET_RESULT.WON }
        },
        include: [{
          model: this.context.dbModels.User,
          as: 'user',
          attributes: ['firstName', 'lastName']
        }, {
          model: this.context.dbModels.CrashGameRoundDetail,
          as: 'roundDetail',
          where: { roundState: CRASH_GAME_STATE.STOPPED, gameId },
          required: true
        }],
        order: [[this.args.orderBy, 'DESC']],
        limit: perPage,
        offset: (page - 1) * perPage
      })

      return { page, bets: bets.rows, totalPages: Math.ceil(bets.count / perPage) }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
