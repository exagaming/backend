import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { plus } from 'number-precision'
import { Op } from 'sequelize'
import { BET_TYPES_CODE } from './constants'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'

/**
 *
 *
 * @export
 * @class PlaceFreeSpinBetService
 * @extends {ServiceBase}
 */
export default class PlaceFreeSpinBetService extends ServiceBase {
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

      if (Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'currentGameSettings', 'clientSeed', 'serverSeed', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
        where: {
          gameId,
          userId,
          currencyId,
          result: null,
          freeSpinsLeft: {
            [Op.gt]: 0
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

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      const Current = previousSpinBetState.current

      const whichFreeSpin = previousSpinBetState.next.FreeSpin.Next

      // Load current spin details
      const currentSpin = currentSlotGameBet.freeSpinWinningCombination[(whichFreeSpin - 1)]
      const newFreeSpinsAwardedInThisFreeSpin = +currentSpin.moreAwarded

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      const totalPayout = +currentSpin.payout

      currentSlotGameBet.freeSpinsLeft = currentSlotGameBet.freeSpinsLeft - 1
      currentSlotGameBet.freeSpinWinningAmount = plus(currentSlotGameBet.freeSpinWinningAmount, totalPayout)

      if (newFreeSpinsAwardedInThisFreeSpin > 0) {
        currentSlotGameBet.freeSpinsLeft = +currentSlotGameBet.freeSpinsLeft + newFreeSpinsAwardedInThisFreeSpin
        currentSlotGameBet.totalFreeSpinsAwarded = +currentSlotGameBet.totalFreeSpinsAwarded + newFreeSpinsAwardedInThisFreeSpin
      }

      const isLastFreeSpin = +currentSlotGameBet.totalFreeSpinsAwarded === whichFreeSpin

      const amount = plus(currentSlotGameBet.winningAmount, currentSlotGameBet.freeSpinWinningAmount)

      const response = {
        Player: {
          ...currentSlotGameBet.player,
          Balance: wallet?.balance || 0
        },
        Current: {
          Type: BET_TYPES_CODE.FREE_SPIN,
          FreeSpin: {
            Current: whichFreeSpin,
            Total: +currentSlotGameBet.totalFreeSpinsAwarded
          },
          TotalWin: totalPayout,
          AccWin: totalPayout,
          Result: {
            ...(currentSpin.Result)
          },
          Round: {
            ...Current.Round,
            Payout: amount
          }
        },
        Next: {
          ...(!isLastFreeSpin
            ? {
                Type: BET_TYPES_CODE.FREE_SPIN,
                FreeSpin: {
                  Next: (whichFreeSpin + 1),
                  Total: +currentSlotGameBet.totalFreeSpinsAwarded,
                  MoreAwarded: newFreeSpinsAwardedInThisFreeSpin
                }
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
        if (isLastFreeSpin) {
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
