import { ServiceError } from '@src/errors/service.error'
import ServiceBase from '@src/libs/serviceBase'
import { CreditService } from '@src/services/operator-callback/credit.service'
import WalletEmitter from '@src/socket-resources/emitters/wallet.emitter'
import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'
import { plus, times } from 'number-precision'
import { Op } from 'sequelize'
import { BET_TYPES_CODE, ROUND_TYPES_CODE, STANDARD_REEL_LENGTH } from './constants'
import { FREE_GAME_REEL_WEIGHT_TABLE, REEL_SYMBOLS_KEYS } from './slotConfigs'
import { convertPayWindowToString, convertStringToPayWindow, generateFreeGameCascadingReelElements, generateReelSymbolOccurrenceMapByPayWindow, getAccumulatedMultiplier, getFreeGameRandSymReplacingPayWindowReels, getFreeGameResultThroughPayWindowSymbolOccurrence, getRandomGenerationUsingWeightTable, getTotalMultiplierFromPayWindow } from './slotHelpers'

/**
 *
 *
 * @export
 * @class SlotGamePlaceCascadeInFreeSpinBetService
 * @extends {ServiceBase}
 */
export default class SlotGamePlaceCascadeInFreeSpinBetService extends ServiceBase {
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

      if (Type !== BET_TYPES_CODE.RE_SPIN_IN_FREE_SPIN) throw messages.INVALID_TYPE

      const unfinishedSlotGameBet = await SlotGameBetModel.findOne({
        attributes: { exclude: ['userId', 'gameId', 'currentGameSettings', 'createdAt', 'updatedAt'] },
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

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.RE_SPIN_IN_FREE_SPIN) throw messages.INVALID_TYPE

      const freeSpinsLeft = +unfinishedSlotGameBet.freeSpinsLeft
      const totalFreeSpinsAwarded = +unfinishedSlotGameBet.totalFreeSpinsAwarded
      const serverSeed = unfinishedSlotGameBet.serverSeed
      const betAmount = +unfinishedSlotGameBet.betAmount
      const isBuyFreeSpin = (+unfinishedSlotGameBet.roundType) === ROUND_TYPES_CODE.BUY_FREE_SPIN_PLAY
      const isAnteBet = (+unfinishedSlotGameBet.roundType) === ROUND_TYPES_CODE.ANTE_PLAY

      const whichFreeSpin = totalFreeSpinsAwarded - freeSpinsLeft + 1

      const serialNonce = +previousSpinBetState.id

      const clientSeed = `${unfinishedSlotGameBet.clientSeed}-free-spin-cascade-${whichFreeSpin}-${serialNonce}`

      const Current = previousSpinBetState.current

      const payWindow = convertStringToPayWindow(Current.Result.R)

      const previousAWP = Current.Result.WR?.[0]?.AWP

      let cascadedPayWindow = [...payWindow]

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
          const _cascadingElements = generateFreeGameCascadingReelElements({
            reelNo,
            elementsToBeAdded,
            clientSeed: `${clientSeed}-cascading-${reelNo}`,
            serverSeed,
            isBuyFreeSpin
          })
          return [..._cascadingElements, ...reel]
        }
        return [...reel]
      })

      let cascadedMap = generateReelSymbolOccurrenceMapByPayWindow(cascadedPayWindow)

      if (cascadedMap.get(REEL_SYMBOLS_KEYS.RANDSYM) > 0) {
        cascadedPayWindow = getFreeGameRandSymReplacingPayWindowReels({
          payWindow: cascadedPayWindow,
          map: cascadedMap,
          clientSeed: `${clientSeed}-cascading-randsym-generation`,
          serverSeed
        })
        cascadedMap = generateReelSymbolOccurrenceMapByPayWindow(cascadedPayWindow)
      }

      const whichReel = getRandomGenerationUsingWeightTable({
        weightTable: FREE_GAME_REEL_WEIGHT_TABLE,
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

      const symbolOccurrenceResult = getFreeGameResultThroughPayWindowSymbolOccurrence({
        whichReelForMultiplier,
        clientSeed: `${clientSeed}-cascading-symbol-occurrence-result`,
        serverSeed,
        symbolOccurrenceMap: cascadedMap,
        isBuyFreeSpin,
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

      const localWinningCombination = winningSymbol.reduce((acc, cv) => {
        acc[cv.sym] = cv.ct
        return acc
      }, {})

      const _freeSpinWinningCombination = unfinishedSlotGameBet.freeSpinWinningCombination

      const localFreeSpinWinningCombination = _freeSpinWinningCombination[_freeSpinWinningCombination.length - 1]

      localFreeSpinWinningCombination.push({
        ...localWinningCombination,
        openedMultiplier: netMultiplier,
        openedPayout: winningPayout
      })

      const _accumulatedPayout = localFreeSpinWinningCombination.reduce((acc, cv) => {
        return plus(acc, cv.openedPayout)
      }, 0)

      const accumulatedMultiplier = getAccumulatedMultiplier(unfinishedSlotGameBet.freeSpinWinningCombination)
      // INFO: This netMultiplier is handled in each localWinningAmount, in free spin, MULT symbol not appears in cascade
      const localWinningAmount = times(winningPayout, betAmount)

      // INFO: This is accumulated win for current free spin
      const accumulatedWinWithoutMultiplier = times(_accumulatedPayout, betAmount)

      _freeSpinWinningCombination.pop()

      unfinishedSlotGameBet.freeSpinWinningCombination = [..._freeSpinWinningCombination, localFreeSpinWinningCombination]

      // INFO: This is the multiplier of current cascade
      const totalMultiplierInPayWindow = getTotalMultiplierFromPayWindow(cascadedPayWindow, multiplierArray)

      if (!isCascading) {
        // INFO: This is the case of no cascading
        const thisFreeSpinUpdatedAccumulatedMultiplier = getAccumulatedMultiplier(unfinishedSlotGameBet.freeSpinWinningCombination)
        const thisFreeSpinTotalWinningAmount = times(accumulatedWinWithoutMultiplier, totalMultiplierInPayWindow > 1 ? (thisFreeSpinUpdatedAccumulatedMultiplier || 1) : 1)

        unfinishedSlotGameBet.freeSpinWinningAmount = plus((unfinishedSlotGameBet.freeSpinWinningAmount ?? 0), thisFreeSpinTotalWinningAmount)

        const showPayoutConclusion = plus(+unfinishedSlotGameBet.winningAmount, +unfinishedSlotGameBet.freeSpinWinningAmount)

        unfinishedSlotGameBet.freeSpinsLeft = (freeSpinsLeft - 1)

        const debitTransaction = unfinishedSlotGameBet.transactions[0]

        const isLastFreeSpin = +unfinishedSlotGameBet.freeSpinsLeft === 0

        const response = {
          Player: {
            ...unfinishedSlotGameBet.player
          },
          Current: {
            Type,
            TotalWin: localWinningAmount,
            AccWin: thisFreeSpinTotalWinningAmount,
            FreeSpin: {
              Current: totalFreeSpinsAwarded - +unfinishedSlotGameBet.freeSpinsLeft,
              Total: totalFreeSpinsAwarded
            },
            Result: {
              R,
              C: 1
            },
            Multiplier: totalMultiplierInPayWindow,
            Round: {
              ...Current.Round,
              AccMultiplier: 0,
              Payout: showPayoutConclusion,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}|${thisFreeSpinUpdatedAccumulatedMultiplier}|${showPayoutConclusion}`
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
                    Next: (totalFreeSpinsAwarded - +unfinishedSlotGameBet.freeSpinsLeft + 1),
                    Total: totalFreeSpinsAwarded
                  }
                })
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
          if (isLastFreeSpin) {
            unfinishedSlotGameBet.result = BET_RESULT.WON

            const { response: creditResponse } = await CreditService.run({
              betId: unfinishedSlotGameBet.id,
              gameId,
              userId,
              amount: (+unfinishedSlotGameBet.freeSpinWinningAmount) + (+unfinishedSlotGameBet.winningAmount),
              roundId: unfinishedSlotGameBet.id,
              userCode,
              operatorId,
              currencyId: unfinishedSlotGameBet.currencyId,
              currencyCode,
              operatorUserToken,
              debitTransactionId: debitTransaction.transactionId,
              specialRemark: `FREE_SPIN_${unfinishedSlotGameBet.id}`
            }, this.context)

            if (creditResponse.status === OPERATOR_RESPONSE_CODES.SUCCESS) {
              Balance = creditResponse.wallet.balance

              unfinishedSlotGameBet.player = {
                ...unfinishedSlotGameBet.player,
                Balance
              }

              response.Player = { ...unfinishedSlotGameBet.player }

              WalletEmitter.emitUserWalletBalance(operatorId, userId, creditResponse.wallet)
            }
          }

          return { ...response, Details: { betId: unfinishedSlotGameBet.id, gameId, userId } }
        } catch {
          return { success: false, message: messages.PLEASE_CONTACT_OPERATOR }
        } finally {
          await unfinishedSlotGameBet?.save({ transaction: sequelizeTransaction })
        }
      } else {
        const showPayoutPersistent = plus(+unfinishedSlotGameBet.winningAmount, +unfinishedSlotGameBet.freeSpinWinningAmount)
        const adjustedAccumulatedMultiplier = accumulatedMultiplier - (totalMultiplierInPayWindow > 1 ? totalMultiplierInPayWindow : 0)
        const response = {
          Player: unfinishedSlotGameBet.player,
          Current: {
            Type,
            TotalWin: localWinningAmount,
            AccWin: accumulatedWinWithoutMultiplier,
            FreeSpin: {
              Current: whichFreeSpin,
              Total: totalFreeSpinsAwarded
            },
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
              C: whichFreeSpin
            },
            Multiplier: netMultiplier,
            Round: {
              ...Current.Round,
              Payout: showPayoutPersistent,
              AccMultiplier: 0,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}|${adjustedAccumulatedMultiplier}|${showPayoutPersistent}`
              ]
            }
          },
          Next: {
            Type: BET_TYPES_CODE.RE_SPIN_IN_FREE_SPIN,
            FreeSpin: {
              Next: whichFreeSpin,
              Total: +unfinishedSlotGameBet.totalFreeSpinsAwarded
            }
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
