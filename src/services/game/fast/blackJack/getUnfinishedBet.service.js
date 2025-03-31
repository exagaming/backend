import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { doublingAvailableForBet, insuranceAvailableForBet, splitAvailableForBet } from '@src/utils/blackJack.utils'
import { BET_RESULT } from '@src/utils/constants/game.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    currencyId: { type: 'string' }
  },
  required: ['userId', 'currencyId']
})

export class GetUnfinishedBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          BlackJackGameBet: BlackJackGameBetModel,
          BlackJackGameRound: BlackJackGameRoundModel
        }
      },
      args: { userId, currencyId }
    } = this

    try {
      const blackJackRound = await BlackJackGameRoundModel.findOne({
        where: { userId, currencyId },
        include: [{
          model: BlackJackGameBetModel,
          as: 'mainBet',
          where: { result: BET_RESULT.PENDING },
          required: true
        }, {
          model: BlackJackGameBetModel,
          as: 'insuranceBet'
        }, {
          model: BlackJackGameBetModel,
          as: 'splitBet'
        }, {
          model: BlackJackGameBetModel,
          as: 'doubleBet'
        }]
      })

      const payload = {
        round: null,
        canBetInsured: false,
        canBetSplitted: false,
        canBetDoubled: false
      }

      if (blackJackRound) {
        blackJackRound?.dealerHand.splice(1, 1)
        blackJackRound.dealerPoints = 0
        delete blackJackRound.dataValues.serverSeed
        delete blackJackRound.dataValues.clientSeed
        payload.round = blackJackRound

        payload.canBetSplitted = splitAvailableForBet(...blackJackRound.mainBet.playerHand)
        payload.canBetInsured = (insuranceAvailableForBet(blackJackRound.dealerHand[0]) && !blackJackRound.insuranceBet)
        payload.canBetDoubled = doublingAvailableForBet(blackJackRound.mainBet.playerHand)
      }

      return payload
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
