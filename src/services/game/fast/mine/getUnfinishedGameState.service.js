import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT } from '@src/utils/constants/game.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    currencyId: { type: 'string' }
  },
  required: ['userId', 'currencyId']
})

export class GetUnfinishedGameStateService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {

      const bet = await this.context.dbModels.MineGameBet.findOne({
        attributes: { exclude: ['mineTiles', 'serverSeed', 'winningAmount'] },
        where: { gameId:this.context.auth.gameId, userId: this.args.userId, currencyId: this.args.currencyId, result: BET_RESULT.PENDING },
        order: [['created_at', 'ASC']]
      })

      return bet
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
