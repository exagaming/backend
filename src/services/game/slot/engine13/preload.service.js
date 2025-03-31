import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { operatorErrorMessage } from '@src/utils/constants/operator.constants'
import { DEFAULT_LINE_BET, SLOT_LINE_BET_PER_CURRENCY } from '@src/utils/constants/slot.constants'
import { BET_TYPES_CODE, Line, ROUND_TYPES_CODE } from './constants'

/**
 * @export
 * @class PreloadService
 * @extends {ServiceBase}
 */
export class PreloadService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        SlotGameBet: SlotGameBetModel,
        SlotGameBetState: SlotGameBetStateModel
      },
      auth: {
        userId,
        operatorId,
        currencyId,
        currencyCode,
        operatorUserToken
      }
    } = this.context

    const { gameId } = this.args

    try {
      // if (!SLOT_LINE_BET_PER_CURRENCY[currencyCode]) throw messages.CURRENCY_NOT_SUPPORTED_FOR_LINE_BET
      const lineBetForCurrency = SLOT_LINE_BET_PER_CURRENCY?.[currencyCode] ?? DEFAULT_LINE_BET
      const LineBet = lineBetForCurrency.map(lineBet => lineBet / 4)

      const { wallet, status } = await FundsService.run({
        operatorUserToken,
        currencyCode,
        operatorId
      }, this.context)

      if (+status > 0) throw operatorErrorMessage[status] || messages.BLOCKED_TRANSACTION

      const Player = {
        Balance: wallet.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const Next = {
        Type: 1
      }

      const GameInfo = {
        Line,
        BetValue: [
          1
        ],
        LineBet,
        BuyFeature: [
          {
            RoundType: 2,
            Rate: 100,
            Total: 15
          }
        ]
      }

      // INFO: Check if last bet exists
      const slotGameLastBet = await SlotGameBetModel.findOne({
        where: {
          gameId,
          userId,
          currencyId,
          result: null
        },
        include: [{
          model: SlotGameBetStateModel,
          as: 'betStates'
        }],
        order: [['id', 'DESC'], [{ model: SlotGameBetStateModel, as: 'betStates' }, 'id', 'DESC']],
        subQuery: false,
        useMaster: true
      })

      if (slotGameLastBet) {
        const Next = {
          ...(slotGameLastBet.betStates?.[0].next ?? {})
        }
        return {
          Player,
          Current: slotGameLastBet.betStates?.[0].current,
          Next: {
            ...Next,
            isAnteBet: Next.Type !== BET_TYPES_CODE.BASE && +slotGameLastBet.roundType === ROUND_TYPES_CODE.ANTE_PLAY
          },
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
