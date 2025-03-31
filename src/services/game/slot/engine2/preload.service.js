import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import engineSettings from '@src/libs/slot-engines/data/engine2Settings.json'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { SLOT_LINE_BET_PER_CURRENCY, TRANSACTION_TYPE } from '@src/utils/constants/slot.constants'

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

export class PreloadService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel
        }
      },
      args: { userId, currencyCode, currencyId, gameId, operatorId, operatorUserToken }
    } = this

    try {
      const lastRound = await SlotGameBetModel.findOne({
        where: { gameId, userId, currencyId },
        include: { attributes: ['current', 'next'], model: SlotGameBetStateModel, as: 'betStates' },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

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
          LineBet: SLOT_LINE_BET_PER_CURRENCY[currencyCode] || SLOT_LINE_BET_PER_CURRENCY.DEFAULT
        },
        Status: 200,
        Ts: Date.now(),
        ...(lastRound ? { Next: lastRound.betStates.next, Current: lastRound.betStates.current } : { Next: { Type: TRANSACTION_TYPE.BASE } })
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
