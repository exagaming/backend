import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ServiceBase from '@src/libs/serviceBase'
import engine11 from '@src/libs/slot-engines/engine11'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { SLOT_LINE_BET_PER_CURRENCY } from '@src/utils/constants/slot.constants'
import crypto from 'crypto'
import { plus, times } from 'number-precision'
import { BET_TYPES_CODE } from './constants'

export class PlaceBaseBetService extends ServiceBase {
  async run () {
    try {
      const {
        context: {
          dbModels: {
            SlotGameBet: SlotGameBetModel,
            SlotGameBetState: SlotGameBetStateModel
          },
          sequelizeTransaction,
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
        transaction: sequelizeTransaction
      })

      if (unfinishedSlotGameBet) throw messages.UNFINISHED_SLOT_GAME_BET_EXISTS

      // Fetch and check user wallet
      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)
      if (betAmount > wallet.balance) throw messages.NOT_ENOUGH_BALANCE

      // Check bet amount limit against provided bet amount
      // if (!SLOT_LINE_BET_PER_CURRENCY[currencyCode]) throw messages.CURRENCY_NOT_SUPPORTED_FOR_LINE_BET
      const lineBetArray = SLOT_LINE_BET_PER_CURRENCY[currencyCode] ?? SLOT_LINE_BET_PER_CURRENCY.DEFAULT

      // Check bet amount limit against provided bet amount
      // const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId }, this.context)
      if (betAmount < lineBetArray[0] * Line || betAmount > lineBetArray[lineBetArray.length - 1] * Line) throw messages.BET_AMOUNT_NOT_IN_LIMIT

      const clientSeed = crypto.randomBytes(16).toString('hex')
      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      // Run game and generate result
      let winningAmount = 0

      // Always init engine before using any method
      engine11.init({ clientSeed, serverSeed, betAmount })

      const {
        baseGameDetails: {
          payWindow,
          waysCombinations,
          multiplierMap,
          scatterCount
        },
        freeGameDetails: {
          allFreeSpinDetails,
          isFreeGameTriggered,
          freeSpinsAwarded
        }
      } = engine11.generate({ isBuyFreeSpin })

      const {
        formattedResult,
        totalPayout
      } = engine11.formatResult({
        payWindow,
        waysCombinations,
        multiplierMap
      })

      winningAmount = totalPayout

      const Player = {
        Balance: wallet.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const response = {
        Current: {
          Type: BET_TYPES_CODE.BASE,
          TotalWin: winningAmount,
          AccWin: winningAmount,
          Result: {
            SC: scatterCount,
            R: formattedResult.R,
            WR: formattedResult.WR
          },
          MultiplierMap: multiplierMap,
          Round: {
            RoundType,
            Bet: +betAmount,
            ActualBet: +betAmount,
            BetValue: +betAmount,
            Line,
            LineBet,
            Payout: winningAmount,
            Mode: 1
          }
        },
        Next: {
          ...(isFreeGameTriggered
            ? {
                Type: BET_TYPES_CODE.FREE_SPIN,
                FreeSpin: {
                  Next: 1,
                  Total: freeSpinsAwarded
                }
              }
            : {
                Type: BET_TYPES_CODE.BASE
              })
        },
        Status: 200,
        Ts: Date.now(),
        Player,
        nextServerSeedHash
      }

      // Create slot game bet
      const slotGameBet = await SlotGameBetModel.create({
        userId,
        gameId,
        betAmount,
        winningAmount: winningAmount,
        roundType: RoundType,
        result: isFreeGameTriggered ? null : (winningAmount > 0 ? BET_RESULT.WON : BET_RESULT.LOST),
        currencyId,
        freeSpinWinningAmount: 0,
        freeSpinWinningCombination: allFreeSpinDetails,
        freeSpinsLeft: freeSpinsAwarded,
        totalFreeSpinsAwarded: freeSpinsAwarded,
        currentGameSettings: { Line, LineBet, isBuyFreeSpin },
        player: { ...response.Player },
        clientSeed,
        serverSeed,
        betStates: {
          current: response.Current,
          next: response.Next
        }
      }, {
        include: { model: SlotGameBetStateModel, as: 'betStates' },
        transaction: sequelizeTransaction
      })

      response.Details = {
        betId: slotGameBet.id,
        gameId,
        userId
      }

      const transactionData = { gameId, userId, userCode, currencyId, operatorId, currencyCode, betId: slotGameBet.id, roundId: slotGameBet.id, operatorUserToken, amount: isBuyFreeSpin ? betAmount * 100 : betAmount }

      const { debitTransaction, response: debitResponse } = await DebitService.run(transactionData, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        Player.Balance = debitResponse.wallet.balance

        if (!isFreeGameTriggered) {
          transactionData.amount = plus(+slotGameBet.winningAmount, +slotGameBet.freeSpinWinningAmount)
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
      } else {
        slotGameBet.result = BET_RESULT.CANCELLED
        slotGameBet.winningAmount = 0
        if (slotGameBet.freeSpinsLeft > 0) {
          slotGameBet.freeSpinsLeft = 0
        }

        await slotGameBet?.save({ transaction: sequelizeTransaction })
        return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
      }

      return response
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
