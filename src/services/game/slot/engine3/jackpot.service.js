import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import engine3 from '@src/libs/slot-engines/engine3'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { Engine3GameEmitter } from '@src/socket-resources/emitters/engine3.emitter'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import _ from 'lodash'
import { ROUND_TYPES_CODE, JACKPOT_BOX } from './constants'

/**
 *
 *
 * @export
 * @class JackpotBetService
 * @extends {ServiceBase}
 */
export default class JackpotBetService extends ServiceBase {
  async run () {
    try {
      const {
        context: {
          dbModels: {
            SlotGameBet: SlotGameBetModel,
            Transaction: TransactionModel,
            SlotGameBetState: SlotGameBetStateModel,
            GameSetting: GameSettingModel
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
        args: { RoundType, BoxIndex }
      } = this

      if (RoundType !== ROUND_TYPES_CODE.JACKPOT_PLAY) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
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

      if (!(BoxIndex <= JACKPOT_BOX.maxIndex && BoxIndex >= JACKPOT_BOX.minIndex) ||
       currentSlotGameBet.freeSpinWinningCombination.result.some(jackpot => jackpot.index === BoxIndex)
      ) throw messages.INVALID_JACKPOT_INDEX

      const previousSpinBetState = currentSlotGameBet.betStates?.[0]

      if (previousSpinBetState.next.Type !== ROUND_TYPES_CODE.JACKPOT_PLAY) throw messages.INVALID_TYPE

      const Current = previousSpinBetState.current

      const whichFreeSpin = previousSpinBetState.next.FreeSpin.Next

      // Load and update current spin details
      const currentSpin = currentSlotGameBet.freeSpinWinningCombination.result[whichFreeSpin - 1]
      const updatedResult = _.cloneDeep(currentSlotGameBet.freeSpinWinningCombination.result)
      updatedResult[whichFreeSpin - 1] = { ...currentSpin, index: BoxIndex }
      currentSlotGameBet.freeSpinWinningCombination = { ...currentSlotGameBet.freeSpinWinningCombination, result: updatedResult }

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      currentSlotGameBet.freeSpinsLeft = currentSlotGameBet.freeSpinsLeft - 1

      const isLastFreeSpin = +currentSlotGameBet.totalFreeSpinsAwarded === whichFreeSpin

      let currentJackpot, winJackpot
      if (isLastFreeSpin) {
        currentJackpot = await GameSettingModel.findOne({
          attributes: ['jackpot', 'id'],
          where: { gameId },
          lock: {
            level: sequelizeTransaction.LOCK.UPDATE,
            of: GameSettingModel
          },
          transaction: sequelizeTransaction
        })

        winJackpot = !currentSpin.upgrade ? currentSpin.jackpotType : currentSpin.upgradeTo
        currentSlotGameBet.freeSpinWinningAmount = currentJackpot.jackpot[winJackpot].value

        currentJackpot.jackpot = engine3.restartJackpot(winJackpot, currentJackpot.jackpot)
        await currentJackpot.save({ transaction: sequelizeTransaction })
      }

      const boxOpened = updatedResult.filter(box => box.index != null && box.index >= 0)
      const amount = isLastFreeSpin ? currentSlotGameBet.freeSpinWinningAmount : 0

      const response = {
        Player: {
          Balance: wallet?.balance || 0,
          Rate: 1,
          Currency: currencyCode,
          CoinRate: 100
        },
        Current: {
          Result: currentSpin.jackpotType,
          Type: ROUND_TYPES_CODE.JACKPOT_PLAY,
          jackpotData: updatedResult[whichFreeSpin - 1],
          FreeSpin: {
            Current: whichFreeSpin,
            Total: +currentSlotGameBet.totalFreeSpinsAwarded,
            jackpotOpened: boxOpened
          },
          TotalWin: amount,
          AccWin: amount,
          Round: {
            ...Current.Round,
            Payout: amount,
            Mode: 1
          }
        },
        Next: {
          ...(!isLastFreeSpin
            ? {
                Type: ROUND_TYPES_CODE.JACKPOT_PLAY,
                FreeSpin: {
                  Next: (whichFreeSpin + 1),
                  Total: +currentSlotGameBet.totalFreeSpinsAwarded
                }
              }
            : {
                Type: ROUND_TYPES_CODE.NORMAL_PLAY
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
            amount,
            specialRemark: `GAME_${gameId}_JACKPOT`
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

          Engine3GameEmitter.jackpotInfo(operatorId, gameId, currentJackpot.jackpot)
        }
      } catch {
        return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
      }

      await currentSlotGameBet?.save({ transaction: sequelizeTransaction })

      return { ...response, Details: { betId: currentSlotGameBet.id, gameId, userId } }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
