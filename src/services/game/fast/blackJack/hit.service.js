import { ServiceError } from '@src/errors/service.error'
import { drawCard, drawDealerCards } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { bypassingInsuranceBetValidation } from '@src/utils/blackJack.utils'
import { BLACKJACK, BLACKJACK_BET_TYPES, BLACKJACK_RESULT } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { ResolveBetsService } from './resolveBets.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    currencyPrecision: { type: 'number' }
  },
  required: ['userId', 'operatorUserToken', 'userCode', 'operatorId', 'gameId', 'currencyCode', 'currencyId', 'currencyPrecision']
})

export class HitService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          Transaction: TransactionModel,
          BlackJackGameBet: BlackJackGameBetModel,
          BlackJackGameRound: BlackJackGameRoundModel
        },
        sequelizeTransaction
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
        }],
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: BlackJackGameRoundModel
        },
        transaction: sequelizeTransaction
      })
      if (!blackJackRound) throw messages.NO_PLACED_BET_FOUND
      if (bypassingInsuranceBetValidation(blackJackRound.dealerHand[0], blackJackRound.dealerPoints, blackJackRound.insuranceBet)) throw messages.PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE

      // INFO: Set current resolving bet if split bet do not exists or split bet reached it's limit.
      const currentResolvingBet = (blackJackRound?.splitBet && blackJackRound?.splitBet?.gameResult !== BLACKJACK_RESULT.SPLIT_HOLD) ? blackJackRound.splitBet : blackJackRound.mainBet
      drawCard(blackJackRound, currentResolvingBet)

      let betNotResolved = true

      if (currentResolvingBet.playerPoints >= BLACKJACK) {
        if (currentResolvingBet.betType === BLACKJACK_BET_TYPES.SPLIT) {
          currentResolvingBet.gameResult = BLACKJACK_RESULT.SPLIT_HOLD
        } else if (currentResolvingBet.betType === BLACKJACK_BET_TYPES.MAIN) {
          drawDealerCards(blackJackRound)
          await ResolveBetsService.run({ ...this.args, blackJackRound }, this.context)
          await blackJackRound.save({ transaction: sequelizeTransaction })
          betNotResolved = false
        }
      }

      await currentResolvingBet.save({ transaction: sequelizeTransaction })

      if (betNotResolved) {
        blackJackRound.dealerHand.splice(1, 1)
        blackJackRound.dealerPoints = 0
        delete blackJackRound.dataValues.serverSeed
        delete blackJackRound.dataValues.clientSeed
      }

      return blackJackRound
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
