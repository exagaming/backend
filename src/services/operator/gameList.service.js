import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { gameSettingCacheKey } from '@src/utils/common.utils'
import { startCase } from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'string' }
  },
  required: ['operatorId']
})

export class GetGameListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    let gameSettings = await Cache.get(gameSettingCacheKey(this.args.operatorId))
    if (!gameSettings) {
      gameSettings = await this.context.dbModels.GameSetting.findAll({
        attributes: ['minOdds', 'maxOdds', 'minAutoRate', 'isActive'],
        include: {
          attributes: { exclude: ['restartable', 'createdAt', 'updatedAt'] },
          model: this.context.dbModels.Game,
          as: 'game'
        },
        raw: true,
        nest: true
      })
    }

    return gameSettings?.map(gameSetting => {
      delete gameSetting.game.restartable
      gameSetting.game.isActive = gameSetting.isActive
      gameSetting.game.name = startCase(gameSetting.game.name)
      return {
        ...gameSetting.game,
        settings: {
          minOdds: gameSetting.minOdds,
          maxOdds: gameSetting.maxOdds,
          minAutoRate: gameSetting.minAutoRate
        }
      }
    }) || []
  }
}
