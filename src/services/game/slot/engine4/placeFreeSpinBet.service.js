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
import engine4 from '@src/libs/slot-engines/engine4'

/**
 *
 *
 * @export
 * @class PlaceFreeSpinBetService
 * @extends {ServiceBase}
 */
export class PlaceFreeSpinBetService extends ServiceBase {
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
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
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

      const whichFreeSpin = (+previousSpinBetState.next.FreeSpin.Next)
      const TumbleIndex = 0 // INFO: this is start

      // Load current spin details
      const currentFreeSpinDetail = currentSlotGameBet.freeSpinWinningCombination[(whichFreeSpin - 1)]
      const currentTumbleDetail = currentFreeSpinDetail.tumbleDetails[TumbleIndex]
      const isNextTumble = currentTumbleDetail.isNextTumble
      const currentTumblePayout = currentTumbleDetail.payout

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      let additionalFreeSpinsAwarded = 0

      currentSlotGameBet.freeSpinWinningAmount = plus((+currentSlotGameBet.freeSpinWinningAmount), currentTumblePayout)

      if (!isNextTumble) {
        currentSlotGameBet.freeSpinsLeft = (+currentSlotGameBet.freeSpinsLeft) - 1
        additionalFreeSpinsAwarded = +currentFreeSpinDetail.additionalFreeSpinsAwarded
        currentSlotGameBet.freeSpinsLeft = (+currentSlotGameBet.freeSpinsLeft) + additionalFreeSpinsAwarded
        currentSlotGameBet.totalFreeSpinsAwarded = (+currentSlotGameBet.totalFreeSpinsAwarded) + additionalFreeSpinsAwarded
      }

      const isLastFreeSpin = (+currentSlotGameBet.freeSpinsLeft) === 0

      const combinedBetWinning = plus(currentSlotGameBet.winningAmount, currentSlotGameBet.freeSpinWinningAmount)

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
        TumbleIndex,
        isNextTumble,
        payWindow: currentTumbleDetail.payWindow,
        winningDetails: currentTumbleDetail.winningDetails,
        multiplierMap: currentTumbleDetail.multiplierMap,
        feature: currentTumbleDetail.feature,
        isScatter: ((!isNextTumble) && additionalFreeSpinsAwarded > 0)
      })

      const GlobalMultiplier = {
        ...((!isNextTumble) && currentFreeSpinDetail.isAnyMultiplierPresent
          ? {
              active: currentFreeSpinDetail.isAnyMultiplierPresent,
              multiplier: currentFreeSpinDetail.globalMultiplier
            }
          : {
              active: false,
              multiplier: whichFreeSpin === 1 ? 1 : (previousSpinBetState.current.GlobalMultiplier.multiplier ?? 1)
            })
      }

      const response = {
        Player: {
          ...currentSlotGameBet.player,
          Balance: wallet?.balance || 0
        },
        Current: {
          Type,
          TumbleIndex,
          FreeSpin: {
            Current: whichFreeSpin,
            Total: +currentSlotGameBet.totalFreeSpinsAwarded
          },
          TotalWin: currentTumblePayout,
          AccWin: currentTumblePayout,
          Multiplier: {
            ...extraDetails.multiplier
          },
          GlobalMultiplier,
          Result: {
            ...formattedResult
          },
          Round: {
            ...previousSpinBetState.current.Round,
            Payout: combinedBetWinning,
            Items: [
              ...previousSpinBetState.current.Round.Items,
              `${Type}|${currentTumblePayout}|${GlobalMultiplier.active}|${GlobalMultiplier.multiplier}|${combinedBetWinning}`
            ]
          }
        },
        Next: {
          ...(!isLastFreeSpin
            ? (isNextTumble
                ? {
                    Type: BET_TYPES_CODE.TUMBLE_IN_FREE_SPIN,
                    FreeSpin: {
                      Next: whichFreeSpin,
                      Total: +currentSlotGameBet.totalFreeSpinsAwarded,
                      MoreAwarded: additionalFreeSpinsAwarded
                    }
                  }
                : {
                    Type: BET_TYPES_CODE.FREE_SPIN,
                    FreeSpin: {
                      Next: (whichFreeSpin + 1),
                      Total: +currentSlotGameBet.totalFreeSpinsAwarded,
                      MoreAwarded: additionalFreeSpinsAwarded
                    }
                  })
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
          const amount = combinedBetWinning
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
