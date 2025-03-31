import { ServiceError } from '@src/errors/service.error'
import { randomBlackJackDeck } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { bypassingInsuranceBetValidation, calculateCardPoints, splitAvailableForBet } from '@src/utils/blackJack.utils'
import { BLACKJACK_BET_TYPES } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['currencyCode', 'userId', 'operatorUserToken', 'userCode', 'operatorId', 'gameId', 'currencyId']
})

export class PlaceSplitBetService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
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
        // attributes: { exclude: ['serverSeed', 'clientSeed'] },
        transaction: sequelizeTransaction
      })
      if (!blackJackRound) throw messages.NO_PLACED_BET_FOUND
      if (blackJackRound.splitBet) throw messages.SPLIT_BET_ALREADY_PLACED
      if (blackJackRound.doubleBet) throw messages.DOUBLE_BET_ALREADY_PLACED
      if (blackJackRound.insuranceBet) throw messages.INSURANCE_BET_ALREADY_PLACED
      if (bypassingInsuranceBetValidation(blackJackRound.dealerHand[0], blackJackRound.dealerPoints, blackJackRound.insuranceBet)) throw messages.PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE

      const mainBet = blackJackRound.mainBet
      if (mainBet.playerHand.length !== 2 || !splitAvailableForBet(...mainBet.playerHand)) throw messages.BET_CAN_NOT_BE_SPLITTED

      const cardDeck = randomBlackJackDeck(blackJackRound.clientSeed, blackJackRound.serverSeed)
      const totalCardDistributed = blackJackRound.dealerHand.length + mainBet.playerHand.length

      const playerHand = [mainBet.playerHand[1], cardDeck[totalCardDistributed + 1]]
      const playerPoints = calculateCardPoints(playerHand)

      mainBet.playerHand = [mainBet.playerHand[0], cardDeck[totalCardDistributed]]
      mainBet.playerPoints = calculateCardPoints(mainBet.playerHand)

      const splitBet = await BlackJackGameBetModel.create({
        playerHand,
        playerPoints,
        roundId: blackJackRound.id,
        betAmount: mainBet.betAmount,
        betType: BLACKJACK_BET_TYPES.SPLIT
      }, { transaction: sequelizeTransaction })

      await mainBet.save({ transaction: sequelizeTransaction })

      const { response: debitResponse } = await DebitService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        operatorUserToken,
        betId: splitBet.id,
        amount: splitBet.betAmount,
        roundId: blackJackRound.id
      }, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)
      } else {
        splitBet.result = BET_RESULT.CANCELLED
        await splitBet.save({ transaction: sequelizeTransaction })
      }

      blackJackRound.dataValues.splitBet = splitBet
      delete blackJackRound.dataValues.serverSeed
      delete blackJackRound.dataValues.clientSeed

      return {
        round: {
          ...blackJackRound.dataValues,
          dealerHand: [blackJackRound.dealerHand[0]],
          dealerPoints: 0
        }
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
