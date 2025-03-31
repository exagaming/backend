import { plus } from 'number-precision'
import { BET_TYPES_CODE } from './constants'
import ServiceBase from '@src/libs/serviceBase'
import engine12 from '@src/libs/slot-engines/engine12'
import { ServiceError } from '@src/errors/service.error'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'

/**
 *
 *
 * @export
 * @class FreeSpinService
 * @extends {ServiceBase}
 */
export default class FreeSpinService extends ServiceBase {
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

      const lastBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'currencyId', 'winningCombination', 'gameId', 'currentGameSettings', 'createdAt', 'updatedAt', 'baseSpinWinningCombination'] },
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
        transaction
      })

      if (!lastBet) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      const previousSpinBetState = lastBet.betStates?.[0]

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      // Load previous spin data
      const serverSeed = lastBet.serverSeed
      const clientSeed = lastBet.clientSeed
      const betAmount = +lastBet.betAmount
      const Current = previousSpinBetState.current

      // This is the serial number of the free spin
      const whichFreeSpin = previousSpinBetState.next.FreeSpinNo

      // Load current spin details
      const currentSpin = lastBet.freeSpinWinningCombination[(whichFreeSpin - 1)]

      // Always init engine before using any method
      engine12.init({ clientSeed, serverSeed, betAmount })

      const formattedResult = engine12.formatFreeSpinResult({ result: lastBet.freeSpinWinningCombination, spinCount: (whichFreeSpin - 1) })

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)

      const Player = {
        Balance: wallet?.balance || 0,
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      formattedResult.Current.Round = {
        ...Current.Round,
        Payout: currentSpin.totalWin,
        Items: [
          ...Current.Round.Items,
          `${BET_TYPES_CODE.FREE_SPIN}|${currentSpin.payout}|${'1'}`
        ]
      }

      const response = {
        Player,
        ...formattedResult
      }

      if (response.Current.FreeSpin.Exit) {
        const amount = plus(lastBet.winningAmount, lastBet.freeSpinWinningAmount)
        const winTransactionData = {
          gameId,
          userId,
          operatorUserToken,
          currencyId,
          operatorId,
          currencyCode,
          betId: lastBet.id,
          roundId: lastBet.id,
          debitTransactionId: lastBet.transactions[0].transactionId,
          amount,
          userCode
        }

        const { response: creditResponse } = await CreditService.run(winTransactionData, this.context)
        if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
          Player.Balance = creditResponse.wallet.balance
        }
        await lastBet.set({ result: amount ? BET_RESULT.WON : BET_RESULT.LOST }).save({ transaction })
      }

      await SlotGameBetStateModel.create({
        betId: lastBet.id,
        current: { ...response.Current },
        next: { ...response.Next }
      }, {
        transaction
      })

      return { ...response, Details: { betId: lastBet.id, gameId, userId } }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
