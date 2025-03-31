import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { gameSettingCacheKey } from '@src/utils/common.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'string' },
    gameId: { type: 'string' }
  },
  required: ['operatorId', 'gameId']
})

export class GameStatusService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { operatorId, gameId } = this.args

    const gameStatus = (await Cache.get(gameSettingCacheKey(operatorId))).find(gameSetting => gameSetting.game.id === gameId)
    return {
      isActive: gameStatus.game.isActive,
      operatorGameIsActive: gameStatus.isActive,
      maintenanceMode: gameStatus.maintenanceMode
    }
  }
}
