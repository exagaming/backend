import { ServiceError } from '@src/errors/service.error'
import { drawCard, drawDealerCards } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { bypassingInsuranceBetValidation, doublingAvailableForBet } from '@src/utils/blackJack.utils'
import { BLACKJACK_BET_TYPES } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { ResolveBetsService } from './resolveBets.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    currencyPrecision: { type: 'number' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'operatorUserToken', 'userCode', 'operatorId', 'gameId', 'currencyCode', 'currencyId', 'currencyPrecision']
})

export class PlaceDoubleBetService extends ServiceBase {
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
      args: { userId, operatorUserToken, userCode, operatorId, gameId, currencyCode, currencyId }
    } = this

    try {
      const blackJackRound = await BlackJackGameRoundModel.findOne({
        where: { userId, currencyId },
        include: [{
          model: BlackJackGameBetModel,
          as: 'mainBet',
          include: {
            attributes: ['transactionId'],
            model: TransactionModel,
            as: 'betTransaction',
            required: true
          },
          where: { result: BET_RESULT.PENDING },
          required: true
        }, {
          attributes: ['id'],
          model: BlackJackGameBetModel,
          as: 'insuranceBet'
        }, {
          attributes: ['id'],
          model: BlackJackGameBetModel,
          as: 'splitBet'
        }, {
          attributes: ['id'],
          model: BlackJackGameBetModel,
          as: 'doubleBet'
        }],
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: BlackJackGameRoundModel
        },
        transaction: sequelizeTransaction
      })
      if (!blackJackRound) throw messages.NO_PLACED_BET_FOUND
      if (blackJackRound.splitBet) throw messages.SPLIT_BET_ALREADY_PLACED
      if (blackJackRound.doubleBet) throw messages.DOUBLE_BET_ALREADY_PLACED
      if (blackJackRound.insuranceBet) throw messages.INSURANCE_BET_ALREADY_PLACED
      if (bypassingInsuranceBetValidation(blackJackRound.dealerHand[0], blackJackRound.dealerPoints, blackJackRound.insuranceBet)) throw messages.PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE
      if (!doublingAvailableForBet(blackJackRound.mainBet.playerHand)) throw messages.BET_CAN_NOT_BE_DOUBLED

      const doubleBet = await BlackJackGameBetModel.create({
        roundId: blackJackRound.id,
        betType: BLACKJACK_BET_TYPES.DOUBLE,
        betAmount: blackJackRound.mainBet.betAmount
      }, { transaction: sequelizeTransaction })

      const { response: debitResponse, debitTransaction } = await DebitService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        operatorUserToken,
        betId: doubleBet.id,
        roundId: blackJackRound.id,
        amount: doubleBet.betAmount
      }, this.context)

      doubleBet.betTransaction = doubleBet.dataValues.betTransaction = { transactionId: debitTransaction.transactionId }
      blackJackRound.doubleBet = blackJackRound.dataValues.doubleBet = doubleBet

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)

        drawCard(blackJackRound, blackJackRound.mainBet)
        drawDealerCards(blackJackRound)
        await ResolveBetsService.run({ ...this.args, blackJackRound }, this.context)
      } else {
        doubleBet.winningAmount = 0
        doubleBet.result = BET_RESULT.CANCELLED
      }

      await doubleBet.save({ transaction: sequelizeTransaction })
      await blackJackRound.save({ transaction: sequelizeTransaction })
      await blackJackRound.mainBet.save({ transaction: sequelizeTransaction })

      return blackJackRound
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
