import ServiceBase from '@src/libs/serviceBase'
import { FundsService } from '@src/services/operator-callback/funds.service'
import engineSettings from '@src/libs/slot-engines/data/engine12Settings.json'
import { ENGINE_12_LINE_BET, TRANSACTION_TYPE } from '@src/utils/constants/slot.constants'

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
        currencyId
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

    const response = {
      Player: {
        Balance: +wallet.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      },
      GameInfo: {
        Line: engineSettings.line,
        LineBet: ENGINE_12_LINE_BET,
        BetValue: [
          1
        ]
      },
      Status: 200,
      Ts: Date.now()
    }

    if (lastRound) {
      response.Next = lastRound.betStates.next
      response.Current = lastRound.betStates.current
    } else {
      response.Next = { Type: TRANSACTION_TYPE.BASE }
    }

    return response
  }
}
