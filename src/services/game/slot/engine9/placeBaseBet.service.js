import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ServiceBase from '@src/libs/serviceBase'
import engine9 from '@src/libs/slot-engines/engine9'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { DEFAULT_LINE_BET, SLOT_LINE_BET_PER_CURRENCY } from '@src/utils/constants/slot.constants'
import crypto from 'crypto'
import { plus, times } from 'number-precision'
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
        args: { Type, Line, LineBet, isBuyFreeSpin, RoundType, isBuyHoldAndSpinner, VolatilityMode }
      } = this

      if (Type !== BET_TYPES_CODE.BASE) throw messages.INVALID_TYPE

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
      const lineBetArray = SLOT_LINE_BET_PER_CURRENCY?.[currencyCode] ?? DEFAULT_LINE_BET

      // Check bet amount limit against provided bet amount
      if (betAmount < lineBetArray[0] * Line || betAmount > lineBetArray[lineBetArray.length - 1] * Line) throw messages.BET_AMOUNT_NOT_IN_LIMIT

      const clientSeed = crypto.randomBytes(16).toString('hex')
      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      // Run game and generate result
      let winningAmount = 0

      // Always init engine before using any method
      engine9.init({ clientSeed, serverSeed, betAmount, volatilityMode: VolatilityMode })

      const {
        baseGameDetails: {
          result,
          payWindow,
          multiplier,
          multiplierMap
        },
        freeGameDetails
      } = engine9.generate()

      const {
        formattedResult,
        totalPayout
      } = engine9.formatResult({
        result,
        payWindow,
        multiplier
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
          Type,
          TotalWin: winningAmount,
          AccWin: winningAmount,
          Multiplier: multiplier,
          MultiplierMap: multiplierMap,
          Result: {
            ...formattedResult
          },
          Round: {
            RoundType,
            Bet: +betAmount,
            ActualBet: +betAmount,
            BetValue: +betAmount,
            Line,
            LineBet,
            Payout: winningAmount,
            Items: [
              `${Type}|${winningAmount}`
            ]
          }
        },
        Next: {
          ...(freeGameDetails.isFreeGameTriggered
            ? {
                Type: BET_TYPES_CODE.FREE_SPIN,
                FreeSpin: {
                  Next: 1,
                  Total: freeGameDetails.freeSpinsAwarded
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
        result: freeGameDetails.isFreeGameTriggered ? null : winningAmount > 0 ? BET_RESULT.WON : BET_RESULT.LOST,
        currencyId,
        roundType: RoundType,
        freeSpinWinningAmount: 0,
        baseSpinWinningCombination: { result, payWindow, multiplier, multiplierMap },
        freeSpinWinningCombination: freeGameDetails.freeSpinsGameResult,
        freeSpinsLeft: freeGameDetails.freeSpinsAwarded,
        totalFreeSpinsAwarded: freeGameDetails.freeSpinsAwarded,
        currentGameSettings: { Line, LineBet, isBuyFreeSpin, isBuyHoldAndSpinner },
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

      const transactionData = { gameId, userId, userCode, currencyId, operatorId, currencyCode, betId: slotGameBet.id, roundId: slotGameBet.id, operatorUserToken, amount: isBuyFreeSpin || isBuyHoldAndSpinner ? betAmount * 100 : betAmount }

      const { debitTransaction, response: debitResponse } = await DebitService.run(transactionData, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        Player.Balance = debitResponse.wallet.balance

        transactionData.amount = plus(+slotGameBet.winningAmount, +slotGameBet.freeSpinWinningAmount)
        transactionData.debitTransactionId = debitTransaction.transactionId

        // TODO: Free Game Transaction handled at last
        try {
          const { response: creditResponse } = await CreditService.run(transactionData, this.context)
          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            Player.Balance = creditResponse.wallet.balance
          }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
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
      console.log(error)
      throw new ServiceError(error)
    }
  }
}
