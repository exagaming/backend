import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT } from '@src/utils/constants/game.constants'

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

    const plinkoGameBets = await this.context.dbModels.PlinkoGameBet.findAndCountAll({
      where: { userId, currencyId, result: [BET_RESULT.WON, BET_RESULT.LOST] },
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['createdAt', 'DESC']],
      raw: true
    })

    return { page, bets: plinkoGameBets.rows, totalPages: Math.ceil(plinkoGameBets.count / perPage) }
  }
}
