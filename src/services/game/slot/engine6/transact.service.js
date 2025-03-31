import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_TYPES_CODE, ROUND_TYPES_CODE } from '@src/services/game/slot/engine6/constants'
import { messages } from '@src/utils/constants/error.constants'
import { PlaceBaseBetService } from './placeBaseBet.service'
import { PlaceTumbleBetService } from './placeTumbleBet.service'
import { PlaceFreeSpinBetService } from './placeFreeSpinBet.service'
import { PlaceTumbleInFreeSpinBet } from './placeTumbleInFreeSpinBet.service'

const schema = {
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
}

const constraints = ajv.compile(schema)

/**
 *
 *
 * @export
 * @class TransactService
 * @extends {ServiceBase}
 */
export class TransactService extends ServiceBase {
  get constrains () {
    return constraints
  }

  async run () {
    try {
      const { Type, RoundType } = this.args

      let result = {}

      if (RoundType === ROUND_TYPES_CODE.NORMAL_PLAY) {
        if (Type === BET_TYPES_CODE.BASE) {
          result = await PlaceBaseBetService.run(this.args, this.context)
        } else if (Type === BET_TYPES_CODE.TUMBLE_IN_BASE_SPIN) {
          result = await PlaceTumbleBetService.run(this.args, this.context)
        } else if (Type === BET_TYPES_CODE.FREE_SPIN) {
          result = await PlaceFreeSpinBetService.run(this.args, this.context)
        } else if (Type === BET_TYPES_CODE.TUMBLE_IN_FREE_SPIN) {
          result = await PlaceTumbleInFreeSpinBet.run(this.args, this.context)
        } else {
          throw messages.INVALID_TYPE
        }
      } else if (RoundType === ROUND_TYPES_CODE.BUY_FREE_SPIN_PLAY) {
        if (Type === BET_TYPES_CODE.BASE) {
          result = await PlaceBaseBetService.run(
            {
              ...this.args,
              isBuyFreeSpin: true
            },
            this.context
          )
        } else {
          throw messages.INVALID_TYPE
        }
      } else {
        throw messages.INVALID_ROUND_TYPE
      }

      return result
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
