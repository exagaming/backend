import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { plus } from 'number-precision'
import { Op } from 'sequelize'
import { BET_TYPES_CODE } from './constants'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'

/**
 *
 *
 * @export
 * @class PlaceHoldAndSpinnerBetService
 * @extends {ServiceBase}
 */
export default class PlaceHoldAndSpinnerBetService extends ServiceBase {
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

      if (Type !== BET_TYPES_CODE.HOLD_AND_SPIN) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'currentGameSettings', 'clientSeed', 'serverSeed', 'createdAt', 'updatedAt', 'freeSpinWinningCombination'] },
        where: {
          gameId,
          userId,
          currencyId,
          result: null,
          baseSpinWinningCombination: {
            [Op.ne]: []
          }
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

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.HOLD_AND_SPIN) throw messages.INVALID_TYPE

      const Current = previousSpinBetState.current

      const whichHoldAndSpin = previousSpinBetState.next.HoldAndSpin.Next

      // Load current spin details
      const currentHoldAndSpin = currentSlotGameBet.baseSpinWinningCombination[(whichHoldAndSpin - 1)]
      const holdAndSpinsLeft = +currentHoldAndSpin.spinsLeft

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      const totalPayout = +currentHoldAndSpin.payout

      currentSlotGameBet.winningAmount = plus(currentSlotGameBet.winningAmount, totalPayout)

      const isLastHoldAndSpin = holdAndSpinsLeft === 0

      const amount = plus(currentSlotGameBet.winningAmount, currentSlotGameBet.freeSpinWinningAmount)

      const response = {
        Player: {
          ...currentSlotGameBet.player,
          Balance: wallet?.balance || 0
        },
        Current: {
          Type: BET_TYPES_CODE.HOLD_AND_SPIN,
          TotalWin: totalPayout,
          AccWin: totalPayout,
          Result: {
            ...(currentHoldAndSpin.Result)
          },
          Round: {
            ...Current.Round,
            Payout: amount
          }
        },
        Next: {
          ...(!isLastHoldAndSpin
            ? {
                Type: BET_TYPES_CODE.HOLD_AND_SPIN,
                HoldAndSpin: {
                  Next: whichHoldAndSpin + 1
                },
                spinsLeft: holdAndSpinsLeft
              }
            : {
                Type: BET_TYPES_CODE.BASE
              })
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
        if (isLastHoldAndSpin) {
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
      } catch {
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
