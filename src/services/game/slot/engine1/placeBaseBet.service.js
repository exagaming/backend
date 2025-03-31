import { ServiceError } from '@src/errors/service.error'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ServiceBase from '@src/libs/serviceBase'
import { GameSettingsService } from '@src/services/common/gameSettings.service'
import { CreditService } from '@src/services/operator-callback/credit.service'
import { DebitService } from '@src/services/operator-callback/debit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { SLOT_LINE_BET_PER_CURRENCY } from '@src/utils/constants/slot.constants'
import crypto from 'crypto'
import { times } from 'number-precision'
import { BET_TYPES_CODE, Line } from './constants'
import { ANTE_BASE_GAME_REEL_A_CONFIGURATION, ANTE_BASE_GAME_REEL_B_CONFIGURATION, ANTE_BASE_GAME_REEL_C_CONFIGURATION, ANTE_REEL_WEIGHT_TABLE, BUY_FREE_SPINS_SCATTER_TRIGGER_WEIGHT_TABLE, BUY_FREE_SPIN_INITIAL_PAYWINDOWS, REEL_A_CONFIGURATION, REEL_B_CONFIGURATION, REEL_C_CONFIGURATION, REEL_WEIGHT_TABLE } from './slotConfigs'
import { convertPayWindowToString, generateRandomNumber, getRandomGenerationUsingWeightTable, getResultThroughPayWindowSymbolOccurrence, shufflePayWindow } from './slotHelpers'

export class PlaceBaseBetService extends ServiceBase {
  async run () {
    try {
      const { Type, isBuyFreeSpin, RoundType, isAnteBet, gameId } = this.args

      const {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel
        },
        sequelizeTransaction,
        auth: {
          userId,
          userCode,
          currencyCode,
          currencyId,
          operatorId,
          operatorUserToken
        }
      } = this.context

      // if (!SLOT_LINE_BET_PER_CURRENCY[currencyCode]) throw messages.CURRENCY_NOT_SUPPORTED_FOR_LINE_BET
      const lineBetForCurrency = SLOT_LINE_BET_PER_CURRENCY[currencyCode] ?? SLOT_LINE_BET_PER_CURRENCY.DEFAULT
      const lineBetArray = lineBetForCurrency.map(lineBet => (lineBet / 4) * (isAnteBet ? 1.25 : 1))

      const betAmount = times(this.args.Line, this.args.LineBet)
      if (betAmount < lineBetArray[0] * Line || betAmount > lineBetArray[lineBetArray.length - 1] * Line) throw messages.BET_AMOUNT_NOT_IN_LIMIT

      const clientSeed = crypto.randomBytes(16).toString('hex')

      const gameSettings = await GameSettingsService.run({ gameId, currencyCode, operatorId }, this.context)

      const { serverSeed, nextServerSeedHash } = await getServerSeed(userId, operatorId)

      if (!serverSeed) throw messages.SERVER_SEED_NOT_FOUND

      const unfinishedSlotGameBet = await SlotGameBetModel.findOne({
        attributes: ['id'],
        where: {
          gameId,
          userId,
          result: null,
          currencyId
        }
      })

      if (unfinishedSlotGameBet) throw messages.UNFINISHED_SLOT_GAME_BET_EXISTS

      // Main Business Logic for Slot Game base bet
      const whichReel = getRandomGenerationUsingWeightTable({
        weightTable: isAnteBet ? ANTE_REEL_WEIGHT_TABLE : REEL_WEIGHT_TABLE,
        clientSeed: `${clientSeed}-reel-select`,
        serverSeed
      })

      let baseReel
      let whichReelForMultiplier

      if (isAnteBet) {
        if (whichReel === 'A') {
          baseReel = ANTE_BASE_GAME_REEL_A_CONFIGURATION
          whichReelForMultiplier = 'A'
        } else if (whichReel === 'B') {
          baseReel = ANTE_BASE_GAME_REEL_B_CONFIGURATION
          whichReelForMultiplier = 'B'
        } else {
          baseReel = ANTE_BASE_GAME_REEL_C_CONFIGURATION
          whichReelForMultiplier = 'A'
        }
      } else {
        if (whichReel === 'A') {
          baseReel = REEL_A_CONFIGURATION
          whichReelForMultiplier = 'A'
        } else if (whichReel === 'B') {
          baseReel = REEL_B_CONFIGURATION
          whichReelForMultiplier = 'B'
        } else {
          baseReel = REEL_C_CONFIGURATION
          whichReelForMultiplier = 'A'
        }
      }

      const baseReelMatrix = [
        baseReel.REEL_1.reel_sequence,
        baseReel.REEL_2.reel_sequence,
        baseReel.REEL_3.reel_sequence,
        baseReel.REEL_4.reel_sequence,
        baseReel.REEL_5.reel_sequence,
        baseReel.REEL_6.reel_sequence
      ]

      let payWindow = []

      for (let i = 0; i < 6; i++) {
        const REEL = baseReelMatrix[i]
        const reelLength = REEL.length
        // Number will be generated between [1, reelLength]
        const rand = generateRandomNumber({
          clientSeed: `${clientSeed}-base-game-reel-index-generation-${i + 1}`,
          serverSeed,
          maxNumber: reelLength
        })

        const _reelPart = []

        for (let j = 0; j < 5; j++) {
          _reelPart.push(REEL[((rand + j - 1) % reelLength)])
        }

        payWindow.push(_reelPart)
      }

      if (isBuyFreeSpin) {
        const howManyScatterTrigger = getRandomGenerationUsingWeightTable({
          weightTable: BUY_FREE_SPINS_SCATTER_TRIGGER_WEIGHT_TABLE,
          clientSeed: `${clientSeed}-base-game-buy-free-spin-initial-paywindow`,
          serverSeed
        })

        payWindow = BUY_FREE_SPIN_INITIAL_PAYWINDOWS[(+howManyScatterTrigger)]
        payWindow = shufflePayWindow({
          payWindow,
          clientSeed: `${clientSeed}-shuffle-pay-window`,
          serverSeed
        })
      }

      const symbolOccurrenceResult = getResultThroughPayWindowSymbolOccurrence({
        payWindow,
        whichReelForMultiplier,
        type: Type,
        clientSeed: `${clientSeed}-base-game-symbol-occurrence-result`,
        serverSeed,
        isAnteBet
      })

      const symbolOccurrenceMap = symbolOccurrenceResult.symbolOccurrenceMap
      // INFO: In the base case, net multiplier will be the accumulated multiplier
      const netMultiplier = symbolOccurrenceResult.netMultiplier
      const winningPayout = symbolOccurrenceResult.winningPayout
      const winningSymbol = symbolOccurrenceResult.winningSymbol
      const multiplierArray = symbolOccurrenceResult.multiplierArray
      const isCascading = symbolOccurrenceResult.isCascading
      const totalFreeSpinsAwarded = symbolOccurrenceResult.totalFreeSpinsAwarded

      const AWP = []
      payWindow.forEach((row) => {
        const arr = []
        row.forEach((symbol, index) => {
          if (symbolOccurrenceMap.get(symbol) >= 8) {
            arr.push(index)
          }
        })
        AWP.push(arr)
      })

      const localWinningAmount = times(winningPayout, betAmount)

      const Player = {
        Rate: 1,
        Currency: currencyCode,
        CoinRate: 100
      }

      const winningCombination = winningSymbol.reduce((acc, cv) => {
        acc[cv.sym] = cv.ct
        return acc
      }, {})

      const baseSpinWinningCombination = [
        {
          ...winningCombination,
          openedMultiplier: netMultiplier,
          openedPayout: winningPayout
        }
      ]

      const slotGameBet = await SlotGameBetModel.create({
        userId: userId,
        betAmount,
        gameId,
        currencyId,
        winningCombination: {},
        baseSpinWinningCombination,
        freeSpinWinningCombination: [],
        roundType: RoundType,
        winningAmount: localWinningAmount,
        freeSpinWinningAmount: 0,
        freeSpinsLeft: totalFreeSpinsAwarded,
        totalFreeSpinsAwarded,
        clientSeed: clientSeed,
        serverSeed,
        result: (isCascading || totalFreeSpinsAwarded > 0) ? null : BET_RESULT.LOST,
        player: { ...Player },
        currentGameSettings: JSON.stringify({
          ...gameSettings
        })
      }, {
        transaction: sequelizeTransaction
      })

      const betDetails = {
        betId: slotGameBet.id,
        gameId,
        userId
      }

      if (!isCascading && totalFreeSpinsAwarded) {
        slotGameBet.winningAmount = times(localWinningAmount, netMultiplier)
      }

      const R = convertPayWindowToString(payWindow, multiplierArray)

      const accumulatedWin = +slotGameBet.winningAmount

      const response = {
        Current: {
          Type,
          TotalWin: localWinningAmount,
          AccWin: accumulatedWin,
          Result: {
            R,
            ...(isCascading
              ? {
                  WR: [
                    {
                    // T: map.get('SCATTER') >= 4 ? 3 : 6,
                      T: 6,
                      AWP,
                      R: `${localWinningAmount}`
                    }
                  ]
                }
              : {}),
            C: 1
          },
          // INFO: This will be the multiplier to be sent in every case
          Multiplier: netMultiplier,
          Round: {
            RoundType,
            Bet: +slotGameBet.betAmount,
            ActualBet: +slotGameBet.betAmount,
            BetValue: this.args.BetValue,
            Line: this.args.Line,
            LineBet: this.args.LineBet,
            Payout: accumulatedWin,
            Items: [
              `${Type}|${winningPayout}|${'1'}|${netMultiplier}`
            ],
            Mode: 1
          }
        },
        Next: {
          // INFO: Only for base game without free game
          // Type: isCascading ? BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE : BET_TYPES_CODE.BASE
          ...(isCascading
            ? {
                Type: BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE
              }
            : (totalFreeSpinsAwarded > 0
                ? {
                    Type: BET_TYPES_CODE.FREE_SPIN,
                    FreeSpin: {
                      Next: 1,
                      Total: totalFreeSpinsAwarded
                    }
                  }
                : {
                    Type: BET_TYPES_CODE.BASE
                  }))

        },
        Status: 200,
        Ts: Date.now()
      }

      await SlotGameBetStateModel.create({
        betId: slotGameBet.id,
        current: response.Current,
        next: response.Next
      }, {
        transaction: sequelizeTransaction
      })

      const { debitTransaction, response: debitResponse } = await DebitService.run({
        betId: slotGameBet.id,
        userId,
        amount: +(isBuyFreeSpin ? times(betAmount, 100) : betAmount),
        gameId,
        roundId: slotGameBet.id,
        userCode,
        operatorId,
        currencyId: slotGameBet.currencyId,
        currencyCode: currencyCode,
        operatorUserToken
      }, this.context)

      if (debitResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
        WalletEmitter.emitUserWalletBalance(operatorId, userId, debitResponse.wallet)

        try {
          slotGameBet.player = {
            ...slotGameBet.player,
            Balance: debitResponse.wallet.balance
          }
          response.Player = {
            ...slotGameBet.player
          }

          if (!isCascading && !totalFreeSpinsAwarded) {
            // INFO: This is the game conclude case for base game and free spin will not be triggered, so it will always be a zero win case
            const { response: creditResponse } = await CreditService.run({
              betId: slotGameBet.id,
              gameId,
              userId,
              amount: +slotGameBet.winningAmount,
              roundId: slotGameBet.id,
              userCode,
              operatorId,
              currencyId: slotGameBet.currencyId,
              currencyCode: currencyCode,
              operatorUserToken,
              debitTransactionId: debitTransaction.transactionId
            }, this.context)

            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)

              slotGameBet.player = {
                ...slotGameBet.player,
                Balance: creditResponse.wallet.balance
              }
              response.Player = {
                ...slotGameBet.player
              }
            }
          }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        } finally {
          await slotGameBet?.save({ transaction: sequelizeTransaction })
        }

        return { ...response, nextServerSeedHash, Details: betDetails }
      } else {
        slotGameBet.result = BET_RESULT.CANCELLED
        slotGameBet.winningAmount = 0
        if (slotGameBet.freeSpinsLeft > 0) {
          slotGameBet.freeSpinsLeft = 0
        }

        await slotGameBet?.save({ transaction: sequelizeTransaction })
        return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
