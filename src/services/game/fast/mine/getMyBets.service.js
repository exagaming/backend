import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    currencyId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['userId', 'currencyId']
})

export class GetMyBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, userId, currencyId } = this.args

    const mineGameBets = await this.context.dbModels.MineGameBet.findAndCountAll({
      where: { userId, currencyId, result: { [Op.not]: BET_RESULT.PENDING } },
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset: (page - 1) * perPage,
      raw: true
    })

    return { page, bets: mineGameBets.rows, totalPages: Math.ceil(mineGameBets.count / perPage) }
  }
}
