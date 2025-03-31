import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { BET_TYPES_CODE, ROUND_TYPES_CODE } from './constants'
import { PlaceBaseBetService } from './placeBaseBet.service'
import { PlaceCascadeBetService } from './placeCascadeBet.service'
import SlotGamePlaceCascadeInFreeSpinBetService from './slotGamePlaceCascadeInFreeSpinBet.service'
import SlotGamePlaceFreeSpinBetService from './slotGamePlaceFreeSpinBet.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    Type: { type: 'number' },
    Line: { type: 'number' },
    Mode: { type: 'number' },
    Index: { type: 'number' },
    LineBet: { type: 'number' },
    BetValue: { type: 'number' },
    RoundType: { type: 'number' }
  }
})

export class TransactService extends ServiceBase {
  get constrains () {
    return constraints
  }

  async run () {
    const { Type: type, RoundType: roundType } = this.args
    let result = null

    try {
      if (roundType === ROUND_TYPES_CODE.NORMAL_PLAY) result = await this.normalPlay(type)
      else if (roundType === ROUND_TYPES_CODE.ANTE_PLAY) result = await this.antePlay(type)
      else if (roundType === ROUND_TYPES_CODE.BUY_FREE_SPIN_PLAY) result = await this.buyFreeSpinPlay(type)
      else throw messages.INVALID_ROUND_TYPE

      return result
    } catch (error) {
      throw new ServiceError(error)
    }
  }

  /**
   * @param {string} type
   * @returns {any}
   */
  async normalPlay (type) {
    let result = null

    switch (type) {
      case BET_TYPES_CODE.BASE:
        result = await PlaceBaseBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE:
        result = await PlaceCascadeBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.FREE_SPIN:
        result = await SlotGamePlaceFreeSpinBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.RE_SPIN_IN_FREE_SPIN:
        result = await SlotGamePlaceCascadeInFreeSpinBetService.run(this.args, this.context)
        break
      default:
        throw messages.INVALID_TYPE
    }

    return result
  }

  /**
   * @param {string} type
   * @returns {any}
   */
  async antePlay (type) {
    let result = null
    this.args.isAnteBet = true

    switch (type) {
      case BET_TYPES_CODE.BASE:
        result = await PlaceBaseBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE:
        result = await PlaceCascadeBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.FREE_SPIN:
        result = await SlotGamePlaceFreeSpinBetService.run(this.args, this.context)
        break
      case BET_TYPES_CODE.RE_SPIN_IN_FREE_SPIN:
        result = await SlotGamePlaceCascadeInFreeSpinBetService.run(this.args, this.context)
        break
      default:
        throw messages.INVALID_TYPE
    }

    return result
  }

  /**
   * @param {string} type
   * @returns {any}
   */
  async buyFreeSpinPlay (type) {
    let result = null
    this.args.isBuyFreeSpin = true

    switch (type) {
      case BET_TYPES_CODE.BASE:
        result = await PlaceBaseBetService.run(this.args, this.context)
        break
      default:
        throw messages.INVALID_TYPE
    }

    return result
  }
}
