import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { SLOT_LINE_BET_PER_CURRENCY } from '@src/utils/constants/slot.constants'
import { Line } from './constants'
import { Op } from 'sequelize'
import { BET_RESULT } from '@src/utils/constants/game.constants'

export class PreloadService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        SlotGameBet: SlotGameBetModel,
        SlotGameBetState: SlotGameBetStateModel
      },
      auth: {
        userId,
        currencyCode,
        currencyId,
        gameId,
        operatorId,
        operatorUserToken
      }
    } = this.context

    try {
      const { wallet } = await FundsService.run({ operatorUserToken, currencyCode, operatorId }, this.context)
      const lineBetForCurrency = SLOT_LINE_BET_PER_CURRENCY[currencyCode] || SLOT_LINE_BET_PER_CURRENCY.DEFAULT

      const Player = {
        Balance: +wallet?.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const Next = { Type: 1 }

      const GameInfo = {
        Line,
        BetValue: [1],
        LineBet: lineBetForCurrency,
        BuyFeature: [{
          RoundType: 2,
          Rate: 100,
          Total: 15
        }]
      }

      // INFO: Check if last bet exists
      const slotGameLastBet = await SlotGameBetModel.findOne({
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
        include: [{
          model: SlotGameBetStateModel,
          as: 'betStates'
        }],
        order: [['id', 'DESC'], [{ model: SlotGameBetStateModel, as: 'betStates' }, 'id', 'DESC']],
        useMaster: true
      })

      if (slotGameLastBet) {
        return {
          Player,
          Current: slotGameLastBet.betStates?.[0].current,
          Next: slotGameLastBet.betStates?.[0].next,
          Details: { betId: slotGameLastBet.id, gameId, userId },
          GameInfo,
          Status: 200,
          Ts: Date.now()
        }
      }

      return {
        Player,
        Next,
        GameInfo,
        Status: 200,
        Ts: Date.now()
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
