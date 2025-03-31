import { ServiceError } from '@src/errors/service.error'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import engine3 from '@src/libs/slot-engines/engine3'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { getGambleUsersCacheKey } from '@src/utils/common.utils'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { GAMBLE_DATA, ROUND_TYPES_CODE } from './constants'

/**
 *
 *
 * @export
 * @class GambleBetService
 * @extends {ServiceBase}
 */
export default class GambleBetService extends ServiceBase {
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
        args: { RoundType, SelectedColor, CashOut }
      } = this

      if (RoundType !== ROUND_TYPES_CODE.GAMBLE_PLAY) throw messages.INVALID_TYPE

      const currentSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
        where: {
          gameId,
          userId,
          currencyId
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

      let gambleData = previousSpinBetState?.current?.GambleData

      if (!gambleData) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      const prevGambleData = previousSpinBetState?.current?.CurrentGamble
      const firstSpin = gambleData.length === 0

      let { active: gambleActive, spinsLeft: spinNumber, winAmount, gambleAmount } = prevGambleData
      gambleAmount = winAmount || gambleAmount

      if (!gambleActive) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      if (firstSpin) {
        currentSlotGameBet.result = null
      }

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      if (CashOut) {
        const currentSlotGameBetState = await SlotGameBetStateModel.findOne({
          where: {
            betId: currentSlotGameBet.id
          },
          order: [['id', 'DESC']],
          subQuery: false,
          transaction: sequelizeTransaction
        })

        gambleData = gambleData.map((item, index) =>
          index === gambleData.length - 1
            ? { ...prevGambleData, active: false }
            : item
        )

        const response = {
          Player: {
            Balance: wallet?.balance || 0,
            Rate: 1,
            Currency: currencyCode,
            CoinRate: 100
          },
          Current: {
            Result: BET_RESULT.WON,
            Type: ROUND_TYPES_CODE.GAMBLE_PLAY,
            CurrentGamble: { ...prevGambleData, active: false },
            GambleData: gambleData,
            TotalWin: winAmount,
            AccWin: winAmount,
            Round: {
              ...previousSpinBetState.current.Round,
              Payout: winAmount,
              Mode: 1
            }
          },
          Next: {
            Type: ROUND_TYPES_CODE.NORMAL_PLAY
          },
          Status: 200,
          Ts: Date.now(),
          nextServerSeedHash: 'demo'
        }

        try {
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
            amount: winAmount
          }

          const { response: creditResponse } = await CreditService.run(winTransactionData, this.context)
          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            response.Player.Balance = creditResponse.wallet.balance ?? response.Player.Balance

            currentSlotGameBet.player = {
              ...currentSlotGameBet.player,
              Balance: response.Player.Balance
            }
          }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        }

        currentSlotGameBet.result = BET_RESULT.WON
        currentSlotGameBet.winningAmount = winAmount
        await currentSlotGameBet?.save({ transaction: sequelizeTransaction })

        currentSlotGameBetState.next = response.Next
        currentSlotGameBetState.current = response.Current
        await currentSlotGameBetState?.save({ transaction: sequelizeTransaction })

        return { ...response, Details: { betId: currentSlotGameBet.id, gameId, userId } }
      }

      const { clientSeed, serverSeed, betAmount, currentGameSettings: { betType: BetType } } = currentSlotGameBet
      engine3.init({ clientSeed, serverSeed, betAmount: +betAmount, BetType })

      const { amount: totalPayout, symbol } = engine3.playGamble({ spinNumber, amount: gambleAmount, selectedColor: SelectedColor })

      const isLastSpin = prevGambleData.spinsLeft - 1 === 0 || totalPayout === 0
      const hasWin = totalPayout > 0

      const lastSpinEndingWithWin = isLastSpin && hasWin

      const updatedGambleData = gambleData
      const initialGambleDataObj = { active: true, spinsLeft: 0, gambleAmount: 0, winAmount: 0, symbol: null, selectedColor: SelectedColor }

      if (spinNumber > 0) {
        initialGambleDataObj.spinsLeft = prevGambleData.spinsLeft - 1
        initialGambleDataObj.active = totalPayout > 0
        initialGambleDataObj.gambleAmount = gambleAmount
        initialGambleDataObj.symbol = symbol
        initialGambleDataObj.winAmount = totalPayout

        if (!initialGambleDataObj.spinsLeft) {
          initialGambleDataObj.active = false
          await Cache.setWithTTL(getGambleUsersCacheKey(gameId, operatorId, userId), true, GAMBLE_DATA.REFRESH_TIME)
        }

        updatedGambleData.push(initialGambleDataObj)
      }

      if (isLastSpin) {
        currentSlotGameBet.winningAmount = totalPayout
        currentSlotGameBet.result = totalPayout ? BET_RESULT.WON : BET_RESULT.LOST
      }

      const response = {
        Player: {
          Balance: wallet?.balance || 0,
          Rate: 1,
          Currency: currencyCode,
          CoinRate: 100
        },
        Current: {
          Result: isLastSpin ? (lastSpinEndingWithWin ? BET_RESULT.WON : BET_RESULT.LOST) : BET_RESULT.WON,
          Type: ROUND_TYPES_CODE.GAMBLE_PLAY,
          CurrentGamble: updatedGambleData[updatedGambleData.length - 1],
          GambleData: updatedGambleData,
          TotalWin: totalPayout,
          AccWin: totalPayout,
          Round: {
            ...previousSpinBetState.current.Round,
            Payout: totalPayout,
            Mode: 1
          }
        },
        Next: {
          ...(!isLastSpin
            ? {
                Type: ROUND_TYPES_CODE.GAMBLE_PLAY,
                FreeSpin: {
                  Next: spinNumber - 1,
                  Total: spinNumber - 1
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

      if (firstSpin) {
        const transactionData = {
          gameId,
          userId,
          userCode,
          currencyId,
          operatorId,
          currencyCode,
          betId: currentSlotGameBet.id,
          roundId: currentSlotGameBet.id,
          amount: gambleAmount,
          operatorUserToken
        }

        const { response: debitResponse } = await DebitService.run(transactionData, this.context)
        response.Player.Balance = debitResponse.wallet.balance
        currentSlotGameBet.winningAmount = 0

        if (debitResponse.status !== OPERATOR_RESPONSE_CODES.SUCCESS) {
          currentSlotGameBet.winningAmount = 0
          currentSlotGameBet.result = BET_RESULT.CANCELLED
        }
      }

      if (isLastSpin) {
        try {
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
            amount: totalPayout
          }

          currentSlotGameBet.result = totalPayout ? BET_RESULT.WON : BET_RESULT.LOST

          const { response: creditResponse } = await CreditService.run(winTransactionData, this.context)
          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            response.Player.Balance = creditResponse.wallet.balance ?? response.Player.Balance

            currentSlotGameBet.player = {
              ...currentSlotGameBet.player,
              Balance: response.Player.Balance
            }
          }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        }
      }

      // currentSlotGameBet.winningAmount = totalPayout
      await currentSlotGameBet?.save({ transaction: sequelizeTransaction })

      return { ...response, Details: { betId: currentSlotGameBet.id, gameId, userId } }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
