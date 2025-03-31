import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CRASH_GAME_STATE } from '@src/utils/constants/game.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' }
  },
  required: ['gameId']
})

export class GetRoundHistoryService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const roundDetails = await this.context.dbModels.CrashGameRoundDetail.findAll({
        where: {
          gameId: this.args.gameId,
          roundState: CRASH_GAME_STATE.STOPPED
        },
        order: [['id', 'desc']],
        limit: 50,
        raw: true
      })

      return { bets: roundDetails }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
