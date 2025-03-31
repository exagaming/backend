import { ServiceError } from '@src/errors/service.error'
import { drawDealerCards } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { bypassingInsuranceBetValidation } from '@src/utils/blackJack.utils'
import { BLACKJACK_BET_TYPES, BLACKJACK_RESULT } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { ResolveBetsService } from './resolveBets.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    cardDeck: { type: 'array' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    currencyPrecision: { type: 'number' }
  },
  required: ['userId', 'operatorId', 'gameId', 'userCode', 'operatorUserToken', 'currencyCode', 'currencyId', 'currencyPrecision']
})

export class StandService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { userId, currencyId } = this.args

    const {
      dbModels: {
        Transaction: TransactionModel,
        BlackJackGameBet: BlackJackGameBetModel,
        BlackJackGameRound: BlackJackGameRoundModel
      },
      sequelizeTransaction
    } = this.context

    try {
      const blackJackRound = await BlackJackGameRoundModel.findOne({
        where: { userId, currencyId },
        include: [{
          model: BlackJackGameBetModel,
          as: 'mainBet',
          where: { result: BET_RESULT.PENDING },
          include: {
            attributes: ['transactionId'],
            model: TransactionModel,
            as: 'betTransaction',
            required: true
          },
          required: true
        }, {
          model: BlackJackGameBetModel,
          as: 'splitBet',
          include: {
            attributes: ['transactionId'],
            model: TransactionModel,
            as: 'betTransaction',
            required: true
          }
        }, {
          model: BlackJackGameBetModel,
          as: 'doubleBet',
          include: {
            attributes: ['transactionId'],
            model: TransactionModel,
            as: 'betTransaction',
            required: true
          }
        }, {
          model: BlackJackGameBetModel,
          as: 'insuranceBet'
        }],
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: BlackJackGameRoundModel
        },
        transaction: sequelizeTransaction
      })
      if (!blackJackRound) throw messages.NO_PLACED_BET_FOUND
      if (bypassingInsuranceBetValidation(blackJackRound.dealerHand[0], blackJackRound.dealerPoints, blackJackRound.insuranceBet)) throw messages.PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE

      if (blackJackRound?.splitBet?.betType === BLACKJACK_BET_TYPES.SPLIT && blackJackRound?.splitBet?.gameResult !== BLACKJACK_RESULT.SPLIT_HOLD) {
        blackJackRound.dealerPoints = 0
        blackJackRound.dealerHand = [blackJackRound.dealerHand[0]]
        blackJackRound.splitBet.gameResult = BLACKJACK_RESULT.SPLIT_HOLD

        await blackJackRound.splitBet.save({ transaction: sequelizeTransaction })
      } else {
        drawDealerCards(blackJackRound)
        const { mainBet, splitBet } = await ResolveBetsService.run({ ...this.args, blackJackRound }, this.context)
        blackJackRound.dataValues.mainBet = mainBet
        blackJackRound.dataValues.splitBet = splitBet
        await blackJackRound.save({ transaction: sequelizeTransaction })
      }

      return blackJackRound
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
