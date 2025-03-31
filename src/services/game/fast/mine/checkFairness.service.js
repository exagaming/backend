import { ServiceError } from '@src/errors/service.error'
import { mineGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { MINE_MAX_TILE_COUNT } from '@src/utils/constants/mine.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    clientSeed: { type: 'string' },
    serverSeed: { type: 'string' }
  },
  required: ['clientSeed', 'serverSeed']
})

export class CheckFairnessService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { clientSeed, serverSeed } = this.args
    try {
      const bet = await this.context.dbModels.MineGameBet.findOne({ where: { clientSeed, serverSeed } })
      if (!bet) throw messages.INVALID_SEED

      const mines = mineGameResult(clientSeed, serverSeed, bet.mineCount, MINE_MAX_TILE_COUNT)

      return { clientSeed, serverSeed, mines }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
