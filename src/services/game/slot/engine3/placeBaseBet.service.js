import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import engine3 from '@src/libs/slot-engines/engine3'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import { FundsService } from '@src/services/operator-callback/funds.service'
import { Engine3GameEmitter } from '@src/socket-resources/emitters/engine3.emitter'
import { getGambleUsersCacheKey } from '@src/utils/common.utils'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import crypto from 'crypto'
import { BET_TYPE, GAMBLE_DATA, PAYWINDOW, ROUND_TYPES_CODE, TEST_WIN_RESULTS } from './constants'

export class PlaceBaseBetService extends ServiceBase {
  async run () {
    const {
      context: {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel,
          Transaction: TransactionModel,
          GameSetting: GameSettingModel
        },
        sequelizeTransaction,
        auth: { userId, currencyCode, currencyId, gameId, userCode, operatorId, operatorUserToken }
      },
      args: { BetType }
    } = this

    try {
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

      const lastSlotGameBet = await SlotGameBetModel.findOne({
        attributes: ['id'],
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
        subQuery: false
      })

      if (unfinishedSlotGameBet) throw messages.UNFINISHED_SLOT_GAME_BET_EXISTS

      const betAmount = BET_TYPE[BetType] * PAYWINDOW.line
      if (!betAmount) throw messages.INVALID_BET_DETAILS

      const { wallet } = await FundsService.run({ operatorId, currencyCode, operatorUserToken }, this.context)
      if (betAmount > wallet.balance) throw messages.NOT_ENOUGH_BALANCE

      const clientSeed = crypto.randomBytes(16).toString('hex')
      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      // Generate pay window and result
      engine3.init({ clientSeed, serverSeed, betAmount, BetType })

      let { result, jackpotEnabled } = engine3.generate()
      let { formattedResult, totalPayout } = engine3.formatResult({
        result,
        type: ROUND_TYPES_CODE.NORMAL_PLAY
      })

      let jackpot = { amount: 0, jackpotTypeWithoutUpgrade: '', result: [], upgrade: false, upgradeTo: '' }

      // test
      const baseGameWinEnable = engine3.generateRandomNumber({ clientSeed, serverSeed, maxNumber: TEST_WIN_RESULTS.length })
      if (baseGameWinEnable < 80) {
        const winResults = TEST_WIN_RESULTS[baseGameWinEnable]
        formattedResult = winResults.formattedResult
        totalPayout = winResults.totalPayout
      }
      // test jackpot frontend with 10% probability
      jackpotEnabled = engine3.generateRandomNumber({ clientSeed, serverSeed, maxNumber: 100 }) < 10

      if (jackpotEnabled) {
        jackpot = engine3.playJackpot()
      }

      let canGamble = !jackpotEnabled && totalPayout > 0 && totalPayout < betAmount * GAMBLE_DATA.MAX_AMOUNT
      // test for frontend
      canGamble = !jackpotEnabled && totalPayout > 0 // test

      let prevGambleData
      const prevGambleArray = lastSlotGameBet?.betStates[0]?.current?.GambleData
      if (prevGambleArray) prevGambleData = prevGambleArray[prevGambleArray.length - 1]

      const initialGambleDataObj = { active: false, spinsLeft: 0, gambleAmount: 0, winAmount: 0, symbol: null, SelectedColor: 0 }

      // Check if previous gamble data exists and is valid
      const gambleExpired = await Cache.get(getGambleUsersCacheKey(gameId, operatorId, userId))
      if (gambleExpired) {
        prevGambleData = initialGambleDataObj
      } else {
        prevGambleData = {
          ...initialGambleDataObj,
          gambleAmount: canGamble ? totalPayout : 0,
          active: canGamble,
          spinsLeft: prevGambleData?.spinsLeft || GAMBLE_DATA.SPINS
        }
      }

      const payload = {
        Current: {
          Round: {
            // Line,
            // LineBet,
            BetType,
            Mode: 1,
            Bet: betAmount, // doubt
            BetValue: betAmount, // doubt
            ActualBet: betAmount, // doubt
            Payout: +totalPayout,
            RoundType: ROUND_TYPES_CODE.NORMAL_PLAY,
            Items: [`${ROUND_TYPES_CODE.NORMAL_PLAY}|${totalPayout}|1`]
          },
          GambleData: [],
          CurrentGamble: prevGambleData,
          AccWin: +totalPayout,
          TotalWin: +totalPayout,
          // Multiplier: +multiplier,
          Result: formattedResult,
          Type: ROUND_TYPES_CODE.NORMAL_PLAY
        },
        nextServerSeedHash,
        Details: { gameId, userId },
        Next: {
          ...(jackpotEnabled
            ? {
                Type: ROUND_TYPES_CODE.JACKPOT_PLAY,
                FreeSpin: {
                  Next: 1,
                  Total: jackpot.result.length
                }
              }
            : {
                Type: ROUND_TYPES_CODE.NORMAL_PLAY
              })
        },
        Player: { Rate: 1, CoinRate: 100, Currency: currencyCode, Balance: 0 }// doubt
      }

      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId }, this.context)
      const { minBet, maxBet, maxProfit } = gameSettings

      const bet = await SlotGameBetModel.create({
        userId,
        gameId,
        betAmount,
        currencyId,
        clientSeed,
        serverSeed,
        roundType: ROUND_TYPES_CODE.NORMAL_PLAY,
        result: jackpotEnabled ? null : (totalPayout > 0 ? BET_RESULT.WON : BET_RESULT.LOST),
        freeSpinWinningAmount: jackpot.amount,
        freeSpinWinningCombination: jackpot,
        freeSpinsLeft: jackpot.result.length,
        totalFreeSpinsAwarded: jackpot.result.length,
        player: payload.Player,
        winningAmount: totalPayout,
        currentGameSettings: { minBet, maxBet, maxProfit, betType: BetType },
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
        roundId: bet.id, // doubt
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

      const currentJackpot = await GameSettingModel.findOne({
        attributes: ['jackpot', 'id'],
        where: { gameId },
        lock: {
          level: sequelizeTransaction.LOCK.UPDATE,
          of: GameSettingModel
        },
        transaction: sequelizeTransaction
      })

      currentJackpot.jackpot = engine3.incrementJackpotAmounts(currentJackpot.jackpot)
      await currentJackpot.save({ transaction: sequelizeTransaction })

      Engine3GameEmitter.betsInfo(operatorId, gameId, currentJackpot.jackpot)

      return payload
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
