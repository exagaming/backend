import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { randomBlackJackDeck } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { calculateCardPoints, doublingAvailableForBet, insuranceAvailableForBet, splitAvailableForBet } from '@src/utils/blackJack.utils'
import { BLACKJACK, BLACKJACK_BET_TYPES, BLACKJACK_ODDS, BLACKJACK_RESULT } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { minus, plus, round, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    betAmount: { type: 'number' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    clientSeed: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    currencyPrecision: { type: 'number' }
  },
  required: ['userId', 'operatorId', 'currencyCode', 'currencyId', 'betAmount', 'operatorUserToken', 'gameId', 'clientSeed', 'userCode']
})

export class PlaceBetService extends ServiceBase {
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
      args: { betAmount, clientSeed, operatorUserToken, userId, currencyId, currencyCode, userCode, operatorId, gameId, currencyPrecision }
    } = this

    try {
      const previousRound = await BlackJackGameRoundModel.findOne({
        attributes: ['id'],
        where: { userId, currencyId },
        include: {
          attributes: ['id'],
          model: BlackJackGameBetModel,
          as: 'mainBet',
          where: {
            result: BET_RESULT.PENDING,
            betType: BLACKJACK_BET_TYPES.MAIN
          },
          required: true
        }
      })
      if (previousRound) throw messages.PREVIOUS_BET_NOT_COMPLETED

      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId, includes: false }, this.context)
      if (betAmount < gameSettings.minBet) throw messages.BET_AMOUNT_BELOW_MIN_RANGE
      if (betAmount > gameSettings.maxBet) throw messages.BET_AMOUNT_EXCEEDS_MAX_RANGE

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)
      const cardDeck = randomBlackJackDeck(clientSeed, serverSeed)

      const playerHand = [cardDeck[0], cardDeck[2]]
      const dealerHand = [cardDeck[1], cardDeck[3]]

      const blackJackRound = await BlackJackGameRoundModel.create({
        userId,
        dealerHand,
        currencyId,
        clientSeed,
        serverSeed,
        currentGameSettings: gameSettings,
        dealerPoints: calculateCardPoints(dealerHand),
        mainBet: {
          betAmount,
          playerHand,
          betType: BLACKJACK_BET_TYPES.MAIN,
          playerPoints: calculateCardPoints(playerHand)
        }
      }, {
        include: { model: BlackJackGameBetModel, as: 'mainBet' },
        transaction: sequelizeTransaction
      })

      const canBetInsured = insuranceAvailableForBet(dealerHand[0])
      let betNotResolved = true

      if (blackJackRound.mainBet.playerPoints === BLACKJACK && blackJackRound.dealerPoints === BLACKJACK) {
        blackJackRound.mainBet.winningAmount = blackJackRound.mainBet.betAmount
        blackJackRound.mainBet.result = BET_RESULT.WON
        blackJackRound.mainBet.gameResult = BLACKJACK_RESULT.PUSH
      } else if (blackJackRound.mainBet.playerPoints === BLACKJACK) {
        const profit = round(minus(times(betAmount, BLACKJACK_ODDS.BLACKJACK), betAmount), currencyPrecision)
        blackJackRound.mainBet.winningAmount = round(plus(betAmount, Math.min(profit, gameSettings.maxProfit)), currencyPrecision)

        blackJackRound.mainBet.result = BET_RESULT.WON
        blackJackRound.mainBet.gameResult = BLACKJACK_RESULT.PLAYER_WIN
      } else if (blackJackRound.dealerPoints === BLACKJACK && !canBetInsured) {
        blackJackRound.mainBet.result = BET_RESULT.LOST
        blackJackRound.mainBet.gameResult = BLACKJACK_RESULT.DEALER_BLACKJACK
      }

      const { response: debitResponse, debitTransaction } = await DebitService.run({
        gameId,
        userId,
        userCode,
        operatorId,
        currencyId,
        currencyCode,
        amount: betAmount,
        operatorUserToken,
        roundId: blackJackRound.id,
        betId: blackJackRound.mainBet.id
      }, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)

        // INFO: If player has blackJack then player wins the round and ends here.
        if (blackJackRound.mainBet.result !== BET_RESULT.PENDING) {
          try {
            const { response: creditResponse } = await CreditService.run({
              gameId,
              userId,
              userCode,
              operatorId,
              currencyId,
              currencyCode,
              operatorUserToken,
              roundId: blackJackRound.id,
              betId: blackJackRound.mainBet.id,
              amount: blackJackRound.mainBet.winningAmount,
              debitTransactionId: debitTransaction.transactionId
            }, this.context)

            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
              betNotResolved = false
            }
          } catch (error) {
            return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
          }
        }
      } else {
        blackJackRound.mainBet.winningAmount = 0
        blackJackRound.mainBet.result = BET_RESULT.CANCELLED
      }
      await blackJackRound.mainBet.save({ transaction: sequelizeTransaction })

      if (betNotResolved) {
        delete blackJackRound.dataValues.serverSeed
        delete blackJackRound.dataValues.clientSeed
      }

      return {
        round: {
          ...blackJackRound.dataValues,
          dealerHand: blackJackRound.mainBet.result === BET_RESULT.PENDING ? [dealerHand[0]] : dealerHand,
          dealerPoints: 0
        },
        canBetInsured,
        nextServerSeedHash,
        canBetSplitted: splitAvailableForBet(...playerHand),
        canBetDoubled: doublingAvailableForBet(playerHand)
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
