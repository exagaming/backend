import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { GameCloseService as OperatorGameCloseService } from '@src/services/operator-callback/gameClose.service'
import { gameUserFinancialTokenCacheKey, getOperatorUserServerSeedCacheKey } from '@src/utils/common.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userCode', 'userId', 'operatorId', 'operatorUserToken']
})

export class GameCloseService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userCode, userId, operatorId, operatorUserToken } = this.args

    try {
      await OperatorGameCloseService.run({ operatorUserToken, userCode, operatorId }, this.context)

      await Cache.del(gameUserFinancialTokenCacheKey(operatorId, userId))
      await Cache.del(getOperatorUserServerSeedCacheKey(operatorId, userId))

      return { success: true }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
