import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ServiceBase from '@src/libs/serviceBase'
import engineSettings from '@src/libs/slot-engines/data/engine12Settings.json'
import engine12 from '@src/libs/slot-engines/engine12'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import crypto from 'crypto'
import { minus, plus, times } from 'number-precision'
import { BET_TYPES_CODE } from './constants'
/**
 *
 *
 * @export
 * @class PlaceBaseBetService
 * @extends {ServiceBase}
 */
export class PlaceBaseBetService extends ServiceBase {
  async run () {
    try {
      const {
        context: {
          dbModels: {
            SlotGameBet: SlotGameBetModel,
            SlotGameBetState: SlotGameBetStateModel
          },
          sequelizeTransaction: transaction,
          auth: {
            userId,
            currencyCode,
            currencyId,
            gameId,
            userCode,
            operatorId,
            operatorUserToken
          }
        },
        args: { Line, LineBet, isBuyFreeSpin, RoundType }
      } = this

      const betAmount = times(Line, LineBet)

      // Check previous bet is resolved
      const unfinishedSlotGameBet = await SlotGameBetModel.findOne({
        attributes: ['id'],
        where: {
          gameId,
          userId,
          result: null,
          currencyId
        },
        transaction
      })

      if (unfinishedSlotGameBet) throw messages.UNFINISHED_SLOT_GAME_BET_EXISTS

      // Fetch and check user wallet
      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)
      if (betAmount > wallet.balance) throw messages.NOT_ENOUGH_BALANCE

      // Check bet amount limit against provided bet amount
      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId }, this.context)
      if (betAmount < LineBet[0] * Line || betAmount > LineBet[LineBet.length - 1] * Line) throw messages.BET_AMOUNT_NOT_IN_LIMIT

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)
      const clientSeed = crypto.randomBytes(16).toString('hex')

      // Run game and generate result
      let formattedResult, freeGameWinningCombination
      let freeSpinWinAmount = 0
      let winningAmount = 0

      engine12.init({ clientSeed, serverSeed, betAmount })

      const { payWindow, result, freeGameTriggered } = engine12.generate({ isBuyFreeSpin })

      if (freeGameTriggered) {
        freeSpinWinAmount = result[result.length - 1].totalWin
        const formattedData = engine12.formatResult({ payWindow, result: [], type: BET_TYPES_CODE.BASE, betAmount })
        freeGameWinningCombination = result
        formattedResult = formattedData.formattedResult
      } else {
        const formattedData = engine12.formatResult({ payWindow, result, type: BET_TYPES_CODE.BASE, betAmount })
        formattedResult = formattedData.formattedResult
        winningAmount = formattedData.totalPayout
      }

      // Check for max profit limit if it exceeds assign max profit to the winning amount
      if (winningAmount) {
        const profit = minus(winningAmount, betAmount)
        if (profit > gameSettings.maxProfit) winningAmount = plus(gameSettings.maxProfit, betAmount)
      }
      if (freeSpinWinAmount) {
        const profit = minus(winningAmount, betAmount)
        if (profit > gameSettings.maxProfit) freeSpinWinAmount = plus(gameSettings.maxProfit, betAmount)
      }

      const Player = {
        Balance: wallet.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const payload = {
        NextServerSeedHash: nextServerSeedHash,
        Player,
        Next: freeGameTriggered
          ? {
              Type: BET_TYPES_CODE.FREE_SPIN,
              FreeSpinNo: 1
            }
          : { Type: BET_TYPES_CODE.BASE },
        Current: {
          TotalWin: winningAmount,
          AccWin: winningAmount,
          Type: BET_TYPES_CODE.BASE,
          Result: formattedResult,
          Round: {
            RoundType,
            Bet: +betAmount,
            ActualBet: +betAmount,
            BetValue: +betAmount,
            Line,
            LineBet,
            Payout: winningAmount,
            Items: [`${BET_TYPES_CODE.BASE}|${winningAmount}|1`],
            Mode: 1
          }
        }
      }

      // Create slot game bet
      const bet = await SlotGameBetModel.create({
        userId,
        gameId,
        betAmount,
        winningAmount: winningAmount,
        result: freeGameTriggered ? null : result.length ? BET_RESULT.WON : BET_RESULT.LOST,
        currencyId,
        roundType: RoundType,
        freeSpinWinningAmount: freeSpinWinAmount,
        freeSpinWinningCombination: freeGameWinningCombination,
        currentGameSettings: { Line, LineBet, isBuyFreeSpin },
        player: { ...payload.Player },
        clientSeed,
        serverSeed,
        betStates: {
          current: payload.Current,
          next: payload.Next
        }
      }, {
        include: { model: SlotGameBetStateModel, as: 'betStates' },
        transaction
      })

      payload.Details = {
        betId: bet.id,
        gameId,
        userId
      }

      const transactionData = { gameId, userId, operatorUserToken, currencyId, operatorId, currencyCode, betId: bet.id, amount: isBuyFreeSpin ? betAmount * engineSettings.buyFreeSpin[isBuyFreeSpin].baseBuyAmount : betAmount, userCode, roundId: bet.id }

      const { debitTransaction, response: debitResponse } = await DebitService.run(transactionData, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        Player.Balance = debitResponse.wallet.balance

        if (!freeGameTriggered) {
          transactionData.amount = plus(winningAmount, freeSpinWinAmount)
          transactionData.debitTransactionId = debitTransaction.transactionId

          try {
            const { response: creditResponse } = await CreditService.run(transactionData, this.context)
            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              Player.Balance = creditResponse.wallet.balance
            }
          } catch {
            return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
          }
        }
      }

      return payload
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
