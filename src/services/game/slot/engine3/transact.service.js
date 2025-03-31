import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { ROUND_TYPES_CODE } from '../engine3/constants'
import JackpotBetService from './jackpot.service'
import { PlaceBaseBetService } from './placeBaseBet.service'
import GambleBetService from './gamble.service'

const schema = {
  type: 'object',
  properties: {
    BetType: { type: 'number' },
    RoundType: { type: 'number' },
    BoxIndex: { type: 'number' },
    SelectedColor: { type: 'number' }
  },
  required: ['BetType', 'RoundType']
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
    const {
      args: { RoundType }
    } = this

    try {
      let result = {}

      if (ROUND_TYPES_CODE.NORMAL_PLAY === RoundType) {
        result = await PlaceBaseBetService.run(this.args, this.context)
      } else if (ROUND_TYPES_CODE.JACKPOT_PLAY === RoundType) {
        result = await JackpotBetService.run(this.args, this.context)
      } else if (ROUND_TYPES_CODE.GAMBLE_PLAY === RoundType) {
        result = await GambleBetService.run(this.args, this.context)
      } else {
        throw messages.INVALID_ROUND_TYPE
      }

      return result
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
