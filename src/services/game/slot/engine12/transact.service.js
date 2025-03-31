import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import FreeSpinService from './freeSpin.service'
import { ServiceError } from '@src/errors/service.error'
import { PlaceBaseBetService } from './placeBaseBet.service'
import { BET_TYPES_CODE, ROUND_TYPES_CODE } from './constants'

const schema = {
  type: 'object',
  properties: {
    Type: { type: 'number', enum: [1, 10] },
    BetValue: { type: 'number' },
    Line: { type: 'number' },
    LineBet: { type: 'number' },
    RoundType: { type: 'number', enum: [1, 2] },
    Index: { type: 'number' },
    Mode: { type: 'number' },
    BuyFreeSpins: { type: 'number', enum: [0, 3, 4, 5] }
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
      const { Type, RoundType, BuyFreeSpins } = this.args

      let result = {}

      if (RoundType === ROUND_TYPES_CODE.NORMAL_PLAY) {
        if (Type === BET_TYPES_CODE.BASE) {
          result = await PlaceBaseBetService.run(this.args, this.context)
        } else if (Type === BET_TYPES_CODE.FREE_SPIN) {
          result = await FreeSpinService.run(this.args, this.context)
        }
      } else if (RoundType === ROUND_TYPES_CODE.BUY_FREE_SPIN_PLAY) {
        result = await PlaceBaseBetService.run({
          ...this.args,
          isBuyFreeSpin: BuyFreeSpins
        }, this.context)
      }

      return result
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
