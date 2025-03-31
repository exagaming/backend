import { ServiceError } from '@src/errors/service.error'
import { crashGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { CRASH_GAME_CLIENT_SEED } from '@src/utils/constants/game.constants'
import md5 from 'md5'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    roundHash: { type: 'string' }
  },
  required: ['roundHash', 'gameId']
})

export class CheckFairnessService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { roundHash, gameId } = this.args

    try {
      const roundDetails = await this.context.dbModels.CrashGameRoundDetail.findOne({ where: { roundHash, gameId } })
      if (!roundDetails) throw messages.INVALID_ROUND_HASH

      const settings = roundDetails.dataValues.currentGameSettings

      const crashRate = crashGameResult(roundHash, CRASH_GAME_CLIENT_SEED, settings.minOdds, settings.maxOdds, settings.houseEdge)
      const signature = md5(`${parseFloat(crashRate).toFixed(2)}-${roundHash}`)

      return { crashRate, signature }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
