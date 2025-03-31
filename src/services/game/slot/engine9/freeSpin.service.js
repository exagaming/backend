import { plus } from 'number-precision'
import { BET_TYPES_CODE } from './constants'
import ServiceBase from '@src/libs/serviceBase'
import engine9 from '@src/libs/slot-engines/engine9'
import { ServiceError } from '@src/errors/service.error'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'

/**
 *
 *
 * @export
 * @class FreeSpinService
 * @extends {ServiceBase}
 */
export class FreeSpinService extends ServiceBase {
  async run () {
    try {
      const {
        context: {
          dbModels: {
            SlotGameBet: SlotGameBetModel,
            Transaction: TransactionModel,
            SlotGameBetState: SlotGameBetStateModel
          },
          sequelizeTransaction: transaction,
          auth: {
            userId,
            currencyCode,
            currencyId,
            gameId,
            operatorId,
            operatorUserToken,
            userCode
          }
        },
        args: { Type }
      } = this

      if (Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'currentGameSettings', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
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
        transaction
      })
      if (!currentSlotGameBet) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      const previousSpinBetState = currentSlotGameBet.betStates?.[0]

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      // Load previous spin data
      const serverSeed = currentSlotGameBet.serverSeed
      const clientSeed = currentSlotGameBet.clientSeed
      const betAmount = +currentSlotGameBet.betAmount
      // const Current = previousSpinBetState.current

      // This is the serial number of the free spin
      const whichFreeSpin = (+previousSpinBetState.next.FreeSpin.Next)
      const currentFreeSpinDetail = currentSlotGameBet.freeSpinWinningCombination[(whichFreeSpin - 1)]
      // Always init engine before using any method
      engine9.init({ clientSeed, serverSeed, betAmount })
      const { formattedResult, totalPayout } = engine9.formatFreeSpinResult({
        currentFreeSpinDetail
      })
      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      await currentSlotGameBet.set({
        freeSpinWinningAmount: plus(+currentSlotGameBet.freeSpinWinningAmount, totalPayout),
        freeSpinsLeft: (+currentSlotGameBet.freeSpinsLeft) - 1
      }).save({ transaction })

      const isLastFreeSpin = (+currentSlotGameBet.freeSpinsLeft) === 0

      const Player = {
        Balance: wallet?.balance || 0,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const response = {
        Current: {
          Type,
          TotalWin: totalPayout,
          AccWin: totalPayout,
          Multiplier: currentFreeSpinDetail.multiplier,
          MultiplierMap: currentFreeSpinDetail.multiplierMap,
          FreeSpin: {
            Current: whichFreeSpin,
            Total: +currentSlotGameBet.totalFreeSpinsAwarded
          },
          Result: {
            ...formattedResult
          },
          Round: {
            ...previousSpinBetState.current.Round,
            Payout: plus(currentSlotGameBet.winningAmount, currentSlotGameBet.freeSpinWinningAmount),
            Items: [
              ...previousSpinBetState.current.Round.Items,
              `${Type}|${totalPayout}`
            ]
          }
        },
        Next: {
          ...(isLastFreeSpin
            ? {
                Type: BET_TYPES_CODE.BASE
              }
            : {
                Type: BET_TYPES_CODE.FREE_SPIN,
                FreeSpin: {
                  Next: whichFreeSpin + 1,
                  Total: currentSlotGameBet.freeSpinsAwarded
                }
              })
        },
        Status: 200,
        Ts: Date.now(),
        Player,
        nextServerSeedHash: serverSeed
      }

      await SlotGameBetStateModel.create({
        betId: currentSlotGameBet.id,
        current: { ...response.Current },
        next: { ...response.Next }
      }, {
        transaction
      })

      try {
        if (isLastFreeSpin) {
          const amount = plus(currentSlotGameBet.winningAmount, currentSlotGameBet.freeSpinWinningAmount)
          const winTransactionData = {
            gameId,
            userId,
            operatorUserToken,
            currencyId,
            operatorId,
            currencyCode,
            betId: currentSlotGameBet.id,
            roundId: currentSlotGameBet.id,
            debitTransactionId: currentSlotGameBet.transactions[0].transactionId,
            amount,
            userCode
          }

          await currentSlotGameBet.set({ result: amount ? BET_RESULT.WON : BET_RESULT.LOST }).save({ transaction })

          const { response: creditResponse } = await CreditService.run(winTransactionData, this.context)

          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            Player.Balance = creditResponse.wallet.balance

            await currentSlotGameBet.set({
              player: {
                ...currentSlotGameBet.player,
                Balance: response.Player.Balance
              }
            }).save({ transaction })
          }
        }
      } catch (error) {
        return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
      } finally {
        await currentSlotGameBet.save({ transaction })
      }

      return { ...response, Details: { betId: currentSlotGameBet.id, gameId, userId } }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
