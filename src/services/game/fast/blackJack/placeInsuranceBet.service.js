import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { insuranceAvailableForBet } from '@src/utils/blackJack.utils'
import { BLACKJACK, BLACKJACK_BET_TYPES, BLACKJACK_ODDS } from '@src/utils/constants/blackJack.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { divide, minus, plus, round, times } from 'number-precision'
import { ResolveBetsService } from './resolveBets.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    userId: { type: 'string' },
    userCode: { type: 'string' },
    operatorId: { type: 'string' },
    currencyId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' },
    currencyPrecision: { type: 'number' },
    acceptInsurance: { type: 'boolean', default: true }
  },
  required: ['currencyCode', 'currencyId', 'userId', 'operatorUserToken', 'userCode', 'operatorId', 'gameId']
})

export class PlaceInsuranceBetService extends ServiceBase {
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
      args: { userId, operatorUserToken, userCode, operatorId, gameId, currencyCode, currencyId, currencyPrecision = 2 }
    } = this

    try {
      const blackJackRound = await BlackJackGameRoundModel.findOne({
        attributes: ['id', 'dealerHand'],
        where: { userId, currencyId },
        include: [{
          attributes: ['id', 'betAmount'],
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
        transaction: sequelizeTransaction
      })
      if (!blackJackRound) throw messages.NO_PLACED_BET_FOUND
      if (blackJackRound.splitBet) throw messages.SPLIT_BET_ALREADY_PLACED
      if (blackJackRound.doubleBet) throw messages.DOUBLE_BET_ALREADY_PLACED
      if (blackJackRound.insuranceBet) throw messages.INSURANCE_BET_ALREADY_PLACED
      if (!insuranceAvailableForBet(blackJackRound.dealerHand[0])) throw messages.BET_CAN_NOT_BE_ENSURED

      const gameSettings = blackJackRound.currentGameSetting
      const betAmount = round(divide(blackJackRound.mainBet.betAmount, 2), currencyPrecision)

      let winningAmount = 0
      let result = BET_RESULT.LOST
      let betNotResolved = true

      // INFO: If it's dealer blackjack, main bet will be lost and insurance bet will be won
      if (blackJackRound.dealerPoints === BLACKJACK) {
        result = BET_RESULT.WON
        winningAmount = round(times(betAmount, BLACKJACK_ODDS.INSURANCE_WIN), currencyPrecision)
        const profit = round(minus(winningAmount, betAmount), currencyPrecision)
        if (profit > gameSettings.maxProfit) {
          winningAmount = round(plus(betAmount, gameSettings.maxProfit), currencyPrecision)
        }

        betNotResolved = false
        await ResolveBetsService.run({ ...this.args, blackJackRound }, this.context)
      }

      if (this.args.acceptInsurance) {
        const insuranceBet = await BlackJackGameBetModel.create({
          result,
          betAmount,
          winningAmount,
          roundId: blackJackRound.id,
          betType: BLACKJACK_BET_TYPES.INSURANCE
        }, { transaction: sequelizeTransaction })

        blackJackRound.dataValues.insuranceBet = insuranceBet

        const { response: debitResponse, debitTransaction } = await DebitService.run({
          gameId,
          userId,
          userCode,
          operatorId,
          currencyId,
          currencyCode,
          operatorUserToken,
          betId: insuranceBet.id,
          roundId: blackJackRound.id,
          amount: insuranceBet.betAmount
        }, this.context)

        if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
          WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)

          try {
            const { response: creditResponse } = await CreditService.run({
              gameId,
              userId,
              userCode,
              operatorId,
              currencyId,
              currencyCode,
              operatorUserToken,
              amount: winningAmount,
              betId: insuranceBet.id,
              roundId: blackJackRound.id,
              debitTransactionId: debitTransaction.transactionId
            }, this.context)

            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
            }
          } catch (error) {
            return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
          }
        } else {
          insuranceBet.winningAmount = 0
          insuranceBet.result = BET_RESULT.CANCELLED
          await insuranceBet.save({ transaction: sequelizeTransaction })
        }
      }

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
