import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' }
  },
  required: ['gameId']
})

export class GameDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { gameId } = this.args

    try {
      const allCacheGames = await Cache.get(CACHE_KEYS.GAMES)

      let game = null
      if (allCacheGames) game = _.find(allCacheGames, { gameId })
      if (!game) {
        game = await this.context.dbModels.Game.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { id: gameId },
          raw: true
        })
        if (!game) throw messages.INVALID_GAME_ID
      }

      return game
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
