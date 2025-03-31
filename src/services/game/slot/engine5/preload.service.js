import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { FundsService } from '@src/services/operator-callback/funds.service'
import engineSettings from '@src/libs/slot-engines/data/engine5Settings.json'
import { SLOT_LINE_BET_PER_CURRENCY, TRANSACTION_TYPE } from '@src/utils/constants/slot.constants'
import { Op } from 'sequelize'
import { BET_RESULT } from '@src/utils/constants/game.constants'

export class PreloadService extends ServiceBase {
  async run () {
    const {
      context: {
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
      }
    } = this

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
      include: { model: SlotGameBetStateModel, as: 'betStates' },
      raw: true,
      nest: true,
      order: [['id', 'DESC'], [{ model: SlotGameBetStateModel, as: 'betStates' }, 'id', 'DESC']],
      useMaster: true
    })

    if (!SLOT_LINE_BET_PER_CURRENCY[currencyCode]) throw messages.CURRENCY_NOT_SUPPORTED_FOR_LINE_BET
    const LineBet = SLOT_LINE_BET_PER_CURRENCY[currencyCode]

    const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

    const response = {
      Player: {
        Balance: +wallet?.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      },
      GameInfo: {
        Line: engineSettings.line,
        LineBet,
        BetValue: [
          1
        ],
        BuyFeature: [
          {
            RoundType: 2,
            Multiplier: 100
          },
          {
            RoundType: 3,
            Multiplier: 100
          }
        ],
        SymbolMultiplier: engineSettings.symbolMultiplier,
        Patterns: engineSettings.patterns
      },
      Status: 200,
      Ts: Date.now()
    }

    if (lastRound) {
      response.Next = lastRound.betStates.next
      response.Current = lastRound.betStates.current
      response.Details = { betId: lastRound.id, gameId, userId }
    } else {
      response.Next = { Type: TRANSACTION_TYPE.BASE }
    }

    return response
  }
}
