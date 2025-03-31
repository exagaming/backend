import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { gameSettingCacheKey } from '@src/utils/common.utils'
import { messages } from '@src/utils/constants/error.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    operatorId: { type: 'number' },
    currencyCode: { type: 'string' },
    includes: { type: 'boolean', default: true }
  },
  required: ['gameId', 'operatorId']
})

export class GameSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { gameId, currencyCode } = this.args

    try {
      // const allCacheGameSettings = await Cache.get(gameSettingCacheKey(this.args.operatorId))

      let gameSettings = null
      // if (allCacheGameSettings) gameSettings = _.find(allCacheGameSettings, { gameId })
      if (!gameSettings) {
        gameSettings = await this.context.dbModels.GameSetting.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            model: this.context.dbModels.Game,
            as: 'game',
            where: { id: gameId },
            required: true
          },
          raw: true,
          nest: true
        })
      }
      if (!gameSettings) throw messages.INVALID_GAME_ID

      if (!this.args.includes) {
        delete gameSettings.game
        delete gameSettings?.dataValues?.game
      }
      if (currencyCode) {
        gameSettings.maxBet = +gameSettings.maxBet[currencyCode]
        gameSettings.minBet = +gameSettings.minBet[currencyCode]
        gameSettings.maxProfit = +gameSettings.maxProfit[currencyCode]
      }

      return gameSettings
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
