import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { BLACKJACK, BLACKJACK_BET_TYPES, BLACKJACK_ODDS, BLACKJACK_RESULT } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { minus, plus, round, times } from 'number-precision'

// NOTE: Please call this service internally with sequelize model instances.

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
    blackJackRound: { type: 'object' },
    operatorUserToken: { type: 'string' },
    currencyPrecision: { type: 'number' }
  },
  required: ['userId', 'operatorId', 'gameId', 'userCode', 'operatorUserToken', 'currencyCode', 'currencyId', 'currencyPrecision']
})

export class ResolveBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: { sequelizeTransaction },
      args: { userId, operatorId, gameId, userCode, operatorUserToken, currencyCode, currencyId, currencyPrecision, blackJackRound }
    } = this

    try {
      let mainBet, splitBet, doubleBet

      const betsToResolve = [blackJackRound.mainBet]
      if (blackJackRound.splitBet) betsToResolve.push(blackJackRound.splitBet)

      // INFO: If (split and main) or only main bet is found then it's logically important to,
      //       share win transaction and conclude all the bets of a blackjack round at the end.

      betsToResolve.forEach(bet => {
        const profit = round(minus(times(+bet.betAmount, BLACKJACK_ODDS.WIN), +bet.betAmount), currencyPrecision)
        bet.winningAmount = round(plus(bet.betAmount, Math.min(profit, blackJackRound.currentGameSettings.maxProfit)), currencyPrecision)

        if (blackJackRound.dealerPoints > bet.playerPoints) {
          if (blackJackRound.dealerPoints > BLACKJACK) {
            bet.result = BET_RESULT.WON
            bet.gameResult = BLACKJACK_RESULT.DEALER_BUST
          } else {
            bet.winningAmount = 0
            bet.result = BET_RESULT.LOST
            bet.gameResult = BLACKJACK_RESULT.DEALER_WIN
          }
        } else if (blackJackRound.dealerPoints < bet.playerPoints) {
          if (bet.playerPoints > BLACKJACK) {
            bet.winningAmount = 0
            bet.result = BET_RESULT.LOST
            bet.gameResult = BLACKJACK_RESULT.PLAYER_BUST
          } else {
            bet.result = BET_RESULT.WON
            bet.gameResult = BLACKJACK_RESULT.PLAYER_WIN
          }
        } else {
          bet.result = BET_RESULT.WON
          bet.gameResult = BLACKJACK_RESULT.PUSH
          bet.winningAmount = +bet.betAmount
        }
      })

      if (blackJackRound.doubleBet) {
        blackJackRound.doubleBet.result = blackJackRound.mainBet.result
        blackJackRound.doubleBet.gameResult = blackJackRound.mainBet.gameResult
        blackJackRound.doubleBet.winningAmount = blackJackRound.mainBet.winningAmount
        betsToResolve.push(blackJackRound.doubleBet)
      }

      await Promise.all(betsToResolve.map(async (bet) => {
        try {
          const { response: creditResponse } = await CreditService.run({
            gameId,
            userId,
            userCode,
            operatorId,
            currencyId,
            currencyCode,
            betId: bet.id,
            operatorUserToken,
            amount: bet.winningAmount,
            roundId: blackJackRound.id,
            debitTransactionId: bet.betTransaction.transactionId
          }, this.context)

          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
          await bet.save({ transaction: sequelizeTransaction })
        } catch (error) {
          bet = { betType: bet.betType, success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        }

        if (bet.betType === BLACKJACK_BET_TYPES.MAIN) mainBet = bet
        if (bet.betType === BLACKJACK_BET_TYPES.SPLIT) splitBet = bet
        if (bet.betType === BLACKJACK_BET_TYPES.DOUBLE) doubleBet = bet
      }))

      return { mainBet, splitBet, doubleBet }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
