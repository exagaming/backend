import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { plus, times } from 'number-precision'
import { BET_TYPES_CODE, ROUND_TYPES_CODE, STANDARD_REEL_LENGTH } from './constants'
import { ANTE_REEL_WEIGHT_TABLE, REEL_SYMBOLS_KEYS, REEL_WEIGHT_TABLE } from './slotConfigs'
import { convertPayWindowToString, convertStringToPayWindow, generateCascadingReelElements, generateReelSymbolOccurrenceMapByPayWindow, getRandSymReplacingPayWindow, getRandomGenerationUsingWeightTable, getResultThroughPayWindowSymbolOccurrence, getTotalMultiplierFromPayWindow } from './slotHelpers'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'

/**
 *
 *
 * @export
 * @class PlaceCascadeBetService
 * @extends {ServiceBase}
 */
export class PlaceCascadeBetService extends ServiceBase {
  async run () {
    try {
      const { Type, gameId } = this.args

      const {
        dbModels: {
          SlotGameBet: SlotGameBetModel,
          SlotGameBetState: SlotGameBetStateModel,
          Transaction: TransactionModel
        },
        sequelizeTransaction,
        auth: {
          userId,
          userCode,
          currencyId,
          currencyCode,
          operatorId,
          operatorUserToken
        }
      } = this.context

      if (Type !== BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE) throw messages.INVALID_TYPE

      const unfinishedSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'gameId', 'currentGameSettings', 'createdAt', 'updatedAt'] },
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
            required: false
          },
          {
            model: SlotGameBetStateModel,
            as: 'betStates'
          }
        ],
        subQuery: false
      })

      if (!unfinishedSlotGameBet) throw messages.BASE_SLOT_GAME_BET_NOT_EXISTS

      const previousSpinBetState = unfinishedSlotGameBet.betStates?.[0]

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE) throw messages.INVALID_TYPE

      const serverSeed = unfinishedSlotGameBet.serverSeed
      const totalFreeSpinsAwarded = +unfinishedSlotGameBet.totalFreeSpinsAwarded

      const serialNonce = +previousSpinBetState.id

      const clientSeed = `${unfinishedSlotGameBet.clientSeed}-base-spin-cascade-${serialNonce}`

      const Current = previousSpinBetState.current

      const isAnteBet = (+unfinishedSlotGameBet.roundType) === ROUND_TYPES_CODE.ANTE_PLAY

      const _payWindow = convertStringToPayWindow(Current.Result.R)

      const previousAWP = Current.Result.WR?.[0]?.AWP

      let cascadedPayWindow = [..._payWindow]

      previousAWP?.forEach((indexes, index) => {
        indexes?.forEach(reelSymbolIndex => {
          cascadedPayWindow[index][reelSymbolIndex] = -2
        })
      })

      cascadedPayWindow = cascadedPayWindow.map(reel => {
        return reel.filter(symbol => symbol !== -2)
      })

      cascadedPayWindow = cascadedPayWindow.map((reel, i) => {
        if (reel.length !== STANDARD_REEL_LENGTH) {
          const reelNo = i + 1
          const elementsToBeAdded = STANDARD_REEL_LENGTH - reel.length
          const _cascadingElements = generateCascadingReelElements({
            reelNo,
            elementsToBeAdded,
            clientSeed: `${clientSeed}-cascading-${reelNo}`,
            serverSeed,
            isAnteBet
          })

          return [..._cascadingElements, ...reel]
        }
        return [...reel]
      })

      const cascadedMap = generateReelSymbolOccurrenceMapByPayWindow(cascadedPayWindow)

      if (cascadedMap.get(REEL_SYMBOLS_KEYS.RANDSYM) > 0) {
        cascadedPayWindow = getRandSymReplacingPayWindow({
          payWindow: cascadedPayWindow,
          map: cascadedMap,
          clientSeed: `${clientSeed}-cascading-rand-sym-generation-${serialNonce + 1}`,
          serverSeed
        })
      }

      const whichReel = getRandomGenerationUsingWeightTable({
        weightTable: isAnteBet ? ANTE_REEL_WEIGHT_TABLE : REEL_WEIGHT_TABLE,
        clientSeed: `${clientSeed}-reel-select`,
        serverSeed
      })

      let whichReelForMultiplier

      if (whichReel === 'A') {
        whichReelForMultiplier = 'A'
      } else if (whichReel === 'B') {
        whichReelForMultiplier = 'B'
      } else {
        whichReelForMultiplier = 'A'
      }

      const symbolOccurrenceResult = getResultThroughPayWindowSymbolOccurrence({
        payWindow: cascadedPayWindow,
        whichReelForMultiplier,
        type: Type,
        clientSeed: `${clientSeed}-cascading-symbol-occurrence-result`,
        serverSeed,
        isAnteBet
      })

      const symbolOccurrenceMap = symbolOccurrenceResult.symbolOccurrenceMap
      const netMultiplier = symbolOccurrenceResult.netMultiplier
      const winningPayout = symbolOccurrenceResult.winningPayout
      const winningSymbol = symbolOccurrenceResult.winningSymbol
      const isCascading = symbolOccurrenceResult.isCascading
      const multiplierArray = symbolOccurrenceResult.multiplierArray

      const R = convertPayWindowToString(cascadedPayWindow, multiplierArray)

      const AWP = []
      cascadedPayWindow.forEach((row) => {
        const arr = []
        row.forEach((symbol, index) => {
          if (symbolOccurrenceMap.get(symbol) >= 8) {
            arr.push(index)
          }
        })
        AWP.push(arr)
      })

      const winningCombination = winningSymbol.reduce((acc, cv) => {
        acc[cv.sym] = cv.ct
        return acc
      }, {})

      unfinishedSlotGameBet.baseSpinWinningCombination = [
        ...unfinishedSlotGameBet.baseSpinWinningCombination,
        { ...winningCombination, openedMultiplier: netMultiplier, openedPayout: winningPayout }
      ]

      const localWinningAmount = times(winningPayout, +unfinishedSlotGameBet.betAmount)

      if (!isCascading) {
        const accumulatedMultiplier = getTotalMultiplierFromPayWindow(cascadedPayWindow, multiplierArray)
        // INFO: This is the game conclude case for base+cascade game and free spin will not be triggered
        unfinishedSlotGameBet.winningAmount = times(plus((unfinishedSlotGameBet.winningAmount ?? 0), localWinningAmount), accumulatedMultiplier)

        const debitTransaction = unfinishedSlotGameBet.transactions[0]

        const response = {
          Player: {
            ...unfinishedSlotGameBet.player
          },
          Current: {
            Type,
            TotalWin: localWinningAmount,
            AccWin: +unfinishedSlotGameBet.winningAmount,
            Result: {
              R,
              C: 1
            },
            // INFO: If game play ends we send the accumulated multiplier
            Multiplier: accumulatedMultiplier,
            Round: {
              ...Current.Round,
              Payout: +unfinishedSlotGameBet.winningAmount,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}`
              ]
            }
          },
          Next: {
            ...(totalFreeSpinsAwarded > 0
              ? {
                  Type: BET_TYPES_CODE.FREE_SPIN,
                  FreeSpin: {
                    Next: 1,
                    Total: totalFreeSpinsAwarded
                  }
                }
              : {
                  Type: BET_TYPES_CODE.BASE
                }
            )
          },
          Status: 200,
          Ts: Date.now()
        }

        await SlotGameBetStateModel.create({
          betId: unfinishedSlotGameBet.id,
          current: { ...response.Current },
          next: { ...response.Next }
        }, {
          transaction: sequelizeTransaction
        })

        let Balance

        try {
          if (!totalFreeSpinsAwarded) {
            unfinishedSlotGameBet.result = BET_RESULT.WON

            const { response: creditResponse } = await CreditService.run({
              betId: unfinishedSlotGameBet.id,
              gameId,
              userId,
              amount: +unfinishedSlotGameBet.winningAmount,
              roundId: unfinishedSlotGameBet.id,
              userCode,
              operatorId,
              currencyId: unfinishedSlotGameBet.currencyId,
              currencyCode: currencyCode,
              operatorUserToken,
              debitTransactionId: debitTransaction.transactionId
            }, this.context)

            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)

              Balance = creditResponse.wallet.balance

              unfinishedSlotGameBet.player = {
                ...unfinishedSlotGameBet.player,
                Balance
              }

              response.Player = { ...unfinishedSlotGameBet.player }
            }
          }

          return { ...response, Details: { betId: unfinishedSlotGameBet.id, gameId, userId } }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        } finally {
          await unfinishedSlotGameBet?.save({ transaction: sequelizeTransaction })
        }
      } else {
        unfinishedSlotGameBet.winningAmount = plus(+(unfinishedSlotGameBet.winningAmount ?? 0), localWinningAmount)

        const response = {
          Player: unfinishedSlotGameBet.player,
          Current: {
            Type,
            TotalWin: localWinningAmount,
            AccWin: +unfinishedSlotGameBet.winningAmount,
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
              C: serialNonce
            },
            // INFO: If game play continue, we send the current multiplier
            Multiplier: netMultiplier,
            Round: {
              ...Current.Round,
              Payout: +unfinishedSlotGameBet.winningAmount,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}`
              ]
            }
          },
          Next: {
            Type: BET_TYPES_CODE.RE_SPIN_AFTER_CASCADE
          },
          Status: 200,
          Ts: Date.now()
        }

        await SlotGameBetStateModel.create({
          betId: unfinishedSlotGameBet.id,
          current: { ...response.Current },
          next: { ...response.Next }
        }, {
          transaction: sequelizeTransaction
        })

        await unfinishedSlotGameBet?.save({ transaction: sequelizeTransaction })

        return { ...response, Details: { betId: unfinishedSlotGameBet.id, gameId, userId } }
      }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
