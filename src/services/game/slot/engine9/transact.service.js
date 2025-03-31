import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_TYPES_CODE, ROUND_TYPES_CODE } from './constants'
import { PlaceBaseBetService } from './placeBaseBet.service'
import { messages } from '@src/utils/constants/error.constants'
import { FreeSpinService } from './freeSpin.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    Type: { type: 'number' },
    BetValue: { type: 'number' },
    Line: { type: 'number' },
    LineBet: { type: 'number' },
    RoundType: { type: 'number' },
    Index: { type: 'number' },
    Mode: { type: 'number' }
  }
})

export class TransactService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    try {
      const { Type, RoundType } = this.args

      let result = {}

      if (RoundType === ROUND_TYPES_CODE.NORMAL_PLAY) {
        if (Type === BET_TYPES_CODE.BASE) {
          result = await PlaceBaseBetService.run(this.args, this.context)
        } else if (Type === BET_TYPES_CODE.FREE_SPIN) {
          result = await FreeSpinService.run(this.args, this.context)
        } else {
          throw messages.INVALID_ROUND_TYPE
        }
      } else {
        throw messages.INVALID_ROUND_TYPE
      }

      return result
    } catch (error) {
      console.log(error)
      throw new ServiceError(error)
    }
  }
}
