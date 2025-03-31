import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import engineSettings from '@src/libs/slot-engines/data/engine3Settings.json'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'
import { ROUND_TYPES_CODE } from './constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'gameId', 'currencyId', 'operatorId', 'currencyCode', 'operatorUserToken']
})

const updatedMultiplier = Object.entries(engineSettings.symbolMultiplier).reduce((acc, [symbol, multipliers]) => {
  const symbolId = engineSettings.symbolIdMap[symbol]
  if (symbolId !== undefined) acc[symbolId] = multipliers
  return acc
}, {})

export class PreloadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel,
          GameSetting: GameSettingModel
        }
      },
      args: { userId, currencyCode, currencyId, gameId, operatorId, operatorUserToken }
    } = this

    try {
      const lastRound = await SlotGameBetModel.findOne({
        where: {
          gameId,
          userId,
          currencyId,
          [Op.or]: [{
            result: {
              [Op.notIn]: [BET_RESULT.CANCELLED]
            }
          }, {
            result: {
              [Op.eq]: null
            }
          }]
        },
        raw: true,
        nest: true,
        include: [{
          model: SlotGameBetStateModel,
          as: 'betStates'
        }],
        order: [['id', 'DESC'], [{ model: SlotGameBetStateModel, as: 'betStates' }, 'id', 'DESC']]
      })
      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      const currentJackpot = await GameSettingModel.findOne({
        attributes: ['jackpot'],
        where: { gameId }
      })

      return {
        Player: {
          Rate: 1,
          CoinRate: 100,
          Currency: currencyCode,
          Balance: +wallet?.balance
        },
        GameInfo: {
          BetValue: [1],
          Line: engineSettings.line,
          payout: updatedMultiplier,
          jackpotValues: currentJackpot.jackpot
        },
        Status: 200,
        Ts: Date.now(),
        ...(lastRound ? { Next: lastRound.betStates.next, Current: lastRound.betStates.current } : { Next: { Type: ROUND_TYPES_CODE.NORMAL_PLAY } })
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
