import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetGamesService extends ServiceBase {
  async run () {
    let gameDetails = await Cache.get(CACHE_KEYS.GAMES)
    if (!gameDetails) {
      gameDetails = await this.context.dbModels.Game.findAll({ raw: true })
    }

    return gameDetails
  }
}
