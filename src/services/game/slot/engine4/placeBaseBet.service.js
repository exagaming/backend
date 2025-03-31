import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ServiceBase from '@src/libs/serviceBase'
import engine4 from '@src/libs/slot-engines/engine4'
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
        args: {
          Line, LineBet,
          isBuyFreeSpin = false, // taking it as false by default, it will be passed true if the condition is favorable
          Type,
          RoundType
        }
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
      engine4.init({
        clientSeed,
        serverSeed,
        betAmount,
        isBuyFreeSpin
      })

      const {
        baseGameDetails: {
          allBaseGameDetails
        },
        freeGameDetails: {
          allFreeSpinDetails,
          isFreeGameTriggered,
          freeSpinsAwarded
        }
      } = engine4.generate()

      const TumbleIndex = 0
      const currentTumbleDetail = allBaseGameDetails[TumbleIndex]
      const isNextTumble = currentTumbleDetail.isNextTumble
      const currentTumblePayout = currentTumbleDetail.payout

      const {
        extraDetails,
        formattedResult
      } = engine4.formatResult({
        TumbleIndex,
        isNextTumble,
        payWindow: currentTumbleDetail.payWindow,
        winningDetails: currentTumbleDetail.winningDetails,
        multiplierMap: currentTumbleDetail.multiplierMap,
        feature: currentTumbleDetail.feature,
        isScatter: ((!isNextTumble) && freeSpinsAwarded > 0)
      })

      winningAmount = currentTumblePayout

      const Player = {
        Balance: wallet.balance,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const response = {
        Current: {
          Type,
          TumbleIndex,
          TotalWin: winningAmount,
          AccWin: winningAmount,
          Multiplier: {
            ...extraDetails.multiplier
          },
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
            Mode: 1,
            Items: [
              `${Type}|${winningAmount}|${winningAmount}`
            ]
          }
        },
        Next: {
          ...(isNextTumble
            ? {
                Type: BET_TYPES_CODE.TUMBLE_IN_BASE_SPIN
              }
            : (freeSpinsAwarded > 0
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
          )

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
        result: (isFreeGameTriggered || isNextTumble) ? null : (winningAmount > 0 ? BET_RESULT.WON : BET_RESULT.LOST),
        currencyId,
        roundType: RoundType,
        freeSpinWinningAmount: 0,
        baseSpinWinningCombination: allBaseGameDetails,
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

        if (!(isFreeGameTriggered || isNextTumble)) {
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
      }

      return response
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
