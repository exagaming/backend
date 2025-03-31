import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

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
    const { perPage, page } = this.args

    const rouletteGameBets = await this.context.dbModels.RouletteGameBet.findAndCountAll({
      where: { userId: this.args.userId, currencyId: this.args.currencyId },
      include: [{
        model: this.context.dbModels.User,
        as: 'user',
        required: true
      }],
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })

    return { page, bets: rouletteGameBets.rows, totalPages: Math.ceil(rouletteGameBets.count / perPage) }
  }
}
