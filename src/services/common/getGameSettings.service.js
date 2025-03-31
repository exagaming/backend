import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { gameSettingCacheKey } from '@src/utils/common.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'string' }
  },
  required: ['operatorId']
})

export class GetGameSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let gameSettings = await Cache.get(gameSettingCacheKey(this.args.operatorId))
    if (!gameSettings) {
      gameSettings = await this.context.dbModels.GameSetting.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: {
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          model: this.context.dbModels.Game,
          as: 'game'
        },
        raw: true,
        nest: true,
        logging: false
      })
    }

    return gameSettings
  }
}
