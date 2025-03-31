import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { engine2 } from '@src/libs/slot-engines/engine2'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { ROUND_TYPE, SLOT_LINE_BET_PER_CURRENCY, TRANSACTION_TYPE } from '@src/utils/constants/slot.constants'
import crypto from 'crypto'
import { round, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    Line: { type: 'number' },
    LineBet: { type: 'number' }
  },
  required: ['Line', 'LineBet']
})

export class TransactService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel
        },
        sequelizeTransaction,
        auth: { userId, currencyCode, currencyId, gameId, userCode, operatorId, operatorUserToken, currencyPrecision }
      },
      args: { Line, LineBet }
    } = this

    try {
      const betAmount = round(times(Line, LineBet), currencyPrecision)
      const lineBetArray = SLOT_LINE_BET_PER_CURRENCY[currencyCode] || SLOT_LINE_BET_PER_CURRENCY.DEFAULT

      if (betAmount < times(lineBetArray[0], Line) || betAmount > times(lineBetArray[lineBetArray.length - 1], Line)) throw messages.BET_AMOUNT_NOT_IN_LIMIT

      const clientSeed = crypto.randomBytes(16).toString('hex')
      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      // Generate pay window and result
      engine2.init({ clientSeed, serverSeed })
      const { result } = engine2.generate()
      const multiplier = engine2.generateMultiplier()
      const { formattedResult, totalPayout } = engine2.formatResult({ result, type: TRANSACTION_TYPE.BASE, multiplier, betAmount })

      const payload = {
        Current: {
          Round: {
            Line,
            LineBet,
            Mode: 1,
            Bet: betAmount,
            BetValue: betAmount,
            ActualBet: betAmount,
            Payout: +totalPayout,
            RoundType: ROUND_TYPE.NORMAL,
            Items: [`${TRANSACTION_TYPE.BASE}|${totalPayout}|1`]
          },
          AccWin: +totalPayout,
          TotalWin: +totalPayout,
          Multiplier: +multiplier,
          Result: formattedResult,
          Type: TRANSACTION_TYPE.BASE
        },
        nextServerSeedHash,
        Details: { gameId, userId },
        Next: { Type: TRANSACTION_TYPE.BASE },
        Player: { Rate: 1, CoinRate: 100, Currency: currencyCode, Balance: 0 }
      }
      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId }, this.context)
      const bet = await SlotGameBetModel.create({
        userId,
        gameId,
        betAmount,
        currencyId,
        clientSeed,
        serverSeed,
        roundType: ROUND_TYPE.NORMAL,
        player: payload.Player,
        winningAmount: totalPayout,
        currentGameSettings: { Line, LineBet, ...gameSettings },
        result: result.length ? BET_RESULT.WON : BET_RESULT.LOST,
        betStates: { current: payload.Current, next: payload.Next }
      }, {
        include: { model: SlotGameBetStateModel, as: 'betStates' },
        transaction: sequelizeTransaction
      })

      payload.Details.betId = bet.id
      const transactionData = {
        gameId,
        userId,
        userCode,
        currencyId,
        operatorId,
        currencyCode,
        betId: bet.id,
        roundId: bet.id,
        amount: betAmount,
        operatorUserToken
      }

      const { debitTransaction, response: debitResponse } = await DebitService.run(transactionData, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        payload.Player.Balance = debitResponse.wallet.balance

        transactionData.amount = totalPayout
        transactionData.debitTransactionId = debitTransaction.transactionId

        try {
          const { response: creditResponse } = await CreditService.run(transactionData, this.context)
          if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
            payload.Player.Balance = creditResponse.wallet.balance
          }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        }
      } else {
        bet.winningAmount = 0
        bet.result = BET_RESULT.CANCELLED
        await bet.save({ transaction: sequelizeTransaction })
      }

      return payload
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
