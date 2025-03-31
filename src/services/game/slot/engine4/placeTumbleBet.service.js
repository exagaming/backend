import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { BET_TYPES_CODE } from './constants'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import engine4 from '@src/libs/slot-engines/engine4'
import { plus, times } from 'number-precision'

/**
 *
 *
 * @export
 * @class PlaceTumbleBetService
 * @extends {ServiceBase}
 */
export class PlaceTumbleBetService extends ServiceBase {
  async run () {
    try {
      const {
        context: {
          dbModels: {
            SlotGameBet: SlotGameBetModel,
            Transaction: TransactionModel,
            SlotGameBetState: SlotGameBetStateModel
          },
          sequelizeTransaction,
          auth: {
            userId,
            userCode,
            currencyCode,
            currencyId,
            gameId,
            operatorId,
            operatorUserToken
          }
        },
        args: { Type }
      } = this

      if (Type !== BET_TYPES_CODE.TUMBLE_IN_BASE_SPIN) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'createdAt', 'updatedAt', 'freeSpinWinningCombination'] },
        where: {
          gameId,
          userId,
          currencyId,
          result: null
        },
        order: [['id', 'DESC'], [{ model: SlotGameBetStateModel, as: 'betStates' }, 'id', 'DESC']],
        include: [
          {
            model: TransactionModel,
            as: 'transactions',
            where: {
              transactionType: TRANSACTION_TYPES.BET
            },
            required: true
          },
          {
            model: SlotGameBetStateModel,
            as: 'betStates'
          }
        ],
        subQuery: false,
        transaction: sequelizeTransaction
      })

      if (!currentSlotGameBet) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      const previousSpinBetState = currentSlotGameBet.betStates?.[0]

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.TUMBLE_IN_BASE_SPIN) throw messages.INVALID_TYPE

      const TumbleIndex = previousSpinBetState.current.TumbleIndex + 1
      const totalFreeSpinsAwarded = currentSlotGameBet.totalFreeSpinsAwarded

      // Load current spin details
      const currentTumbleDetail = currentSlotGameBet.baseSpinWinningCombination[TumbleIndex]
      const isNextTumble = currentTumbleDetail.isNextTumble
      const currentTumblePayout = +currentTumbleDetail.payout

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      // Always init engine before using any method
      engine4.init({
        clientSeed: currentSlotGameBet.clientSeed,
        serverSeed: currentSlotGameBet.serverSeed,
        betAmount: +currentSlotGameBet.betAmount,
        isBuyFreeSpin: currentSlotGameBet.currentGameSettings.isBuyFreeSpin
      })

      const {
        extraDetails,
        formattedResult
      } = engine4.formatResult({
        isNextTumble,
        payWindow: currentTumbleDetail.payWindow,
        winningDetails: currentTumbleDetail.winningDetails,
        multiplierMap: currentTumbleDetail.multiplierMap,
        feature: currentTumbleDetail.feature,
        isScatter: ((!isNextTumble) && totalFreeSpinsAwarded > 0),
        TumbleIndex
      })

      currentSlotGameBet.winningAmount = plus((+currentSlotGameBet.winningAmount), currentTumblePayout)

      if (extraDetails.multiplier.active) {
        currentSlotGameBet.winningAmount = times((+currentSlotGameBet.winningAmount), extraDetails.multiplier.netMultiplier)
      }

      const response = {
        Player: {
          ...currentSlotGameBet.player,
          Balance: wallet?.balance || 0
        },
        Current: {
          Type,
          TumbleIndex,
          TotalWin: currentTumblePayout,
          AccWin: currentSlotGameBet.winningAmount,
          Multiplier: {
            ...extraDetails.multiplier
          },
          Result: {
            ...formattedResult
          },
          Round: {
            ...previousSpinBetState.current.Round,
            Payout: currentSlotGameBet.winningAmount,
            Items: [
              ...previousSpinBetState.current.Round.Items,
              `${Type}|${currentTumblePayout}|${currentSlotGameBet.winningAmount}`
            ]
          }
        },
        Next: {
          ...(isNextTumble
            ? {
                Type: BET_TYPES_CODE.TUMBLE_IN_BASE_SPIN
              }
            : (totalFreeSpinsAwarded > 0
                ? {
                    Type: BET_TYPES_CODE.FREE_SPIN,
                    FreeSpin: {
                      Next: 1,
                      Total: totalFreeSpinsAwarded
                    }
                  }
                : { Type: BET_TYPES_CODE.BASE }))
        },
        Status: 200,
        Ts: Date.now(),
        nextServerSeedHash: 'demo'
      }

      await SlotGameBetStateModel.create({
        betId: currentSlotGameBet.id,
        current: { ...response.Current },
        next: { ...response.Next }
      }, {
        transaction: sequelizeTransaction
      })

      try {
        if (response.Next.Type === BET_TYPES_CODE.BASE) {
          const amount = currentSlotGameBet.winningAmount
          const winTransactionData = {
            gameId,
            userId,
            userCode,
            operatorUserToken,
            currencyId,
            operatorId,
            currencyCode,
            betId: currentSlotGameBet.id,
            roundId: currentSlotGameBet.id,
            debitTransactionId: currentSlotGameBet.transactions[0].transactionId,
            amount
          }

          currentSlotGameBet.result = amount ? BET_RESULT.WON : BET_RESULT.LOST

          const { response: creditResponse } = await CreditService.run(winTransactionData, this.context)

          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            response.Player.Balance = creditResponse.wallet.balance ?? response.Player.Balance

            currentSlotGameBet.player = {
              ...currentSlotGameBet.player,
              Balance: response.Player.Balance
            }
          }
        }
      } catch (error) {
        return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
      } finally {
        await currentSlotGameBet?.save({ transaction: sequelizeTransaction })
      }

      return { ...response, Details: { betId: currentSlotGameBet.id, gameId, userId } }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
