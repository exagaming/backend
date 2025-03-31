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
import { BET_TYPES_CODE, ROUND_TYPES_CODE } from './constants'
import { ANTE_FREE_GAME_REEL_A_CONFIGURATION, ANTE_FREE_GAME_REEL_B_CONFIGURATION, ANTE_FREE_GAME_REEL_WEIGHT_TABLE, FREE_GAME_REEL_A_CONFIGURATION, FREE_GAME_REEL_B_CONFIGURATION, FREE_GAME_REEL_C_CONFIGURATION, FREE_GAME_REEL_WEIGHT_TABLE, REEL_SYMBOLS_KEYS } from './slotConfigs'
import { convertPayWindowToString, generateRandomNumber, generateReelSymbolOccurrenceMapByPayWindow, getAccumulatedMultiplier, getFreeGameRandSymReplacingPayWindowReels, getFreeGameResultThroughPayWindowSymbolOccurrence, getRandomGenerationUsingWeightTable } from './slotHelpers'

/**
 *
 *
 * @export
 * @class SlotGamePlaceFreeSpinBetService
 * @extends {ServiceBase}
 */
export default class SlotGamePlaceFreeSpinBetService extends ServiceBase {
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

      if (Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

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

      if (previousSpinBetState.next.Type !== BET_TYPES_CODE.FREE_SPIN) throw messages.INVALID_TYPE

      const serverSeed = unfinishedSlotGameBet.serverSeed
      const betAmount = +unfinishedSlotGameBet.betAmount
      const freeSpinsLeft = +unfinishedSlotGameBet.freeSpinsLeft
      const totalFreeSpinsAwarded = +unfinishedSlotGameBet.totalFreeSpinsAwarded
      const isBuyFreeSpin = (+unfinishedSlotGameBet.roundType) === ROUND_TYPES_CODE.BUY_FREE_SPIN_PLAY
      const isAnteBet = (+unfinishedSlotGameBet.roundType) === ROUND_TYPES_CODE.ANTE_PLAY

      const whichFreeSpin = totalFreeSpinsAwarded - freeSpinsLeft + 1

      const clientSeed = `${unfinishedSlotGameBet.clientSeed}-free-spin-${whichFreeSpin}`

      const Current = previousSpinBetState.current

      let baseReel
      let whichReelForMultiplier

      const whichReel = getRandomGenerationUsingWeightTable({
        weightTable: isBuyFreeSpin ? ANTE_FREE_GAME_REEL_WEIGHT_TABLE : FREE_GAME_REEL_WEIGHT_TABLE,
        clientSeed: `${clientSeed}-free-spin-reel-select`,
        serverSeed
      })

      if (isBuyFreeSpin) {
        if (whichReel === 'A') {
          baseReel = ANTE_FREE_GAME_REEL_A_CONFIGURATION
          whichReelForMultiplier = 'A'
        } else {
          baseReel = ANTE_FREE_GAME_REEL_B_CONFIGURATION
          whichReelForMultiplier = 'B'
        }
      } else {
        if (whichReel === 'A') {
          baseReel = FREE_GAME_REEL_A_CONFIGURATION
          whichReelForMultiplier = 'A'
        } else if (whichReel === 'B') {
          baseReel = FREE_GAME_REEL_B_CONFIGURATION
          whichReelForMultiplier = 'B'
        } else {
          baseReel = FREE_GAME_REEL_C_CONFIGURATION
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
          clientSeed: `${clientSeed}-free-game-reel-index-generation-${i + 1}`,
          serverSeed,
          maxNumber: reelLength
        })

        const _reelPart = []

        for (let j = 0; j < 5; j++) {
          _reelPart.push(REEL[((rand + j - 1) % reelLength)])
        }

        payWindow.push(_reelPart)
      }

      let freeGameSymbolOccurrenceMap = generateReelSymbolOccurrenceMapByPayWindow(payWindow)

      if (freeGameSymbolOccurrenceMap.get(REEL_SYMBOLS_KEYS.RANDSYM) > 0) {
        payWindow = getFreeGameRandSymReplacingPayWindowReels({
          payWindow,
          map: freeGameSymbolOccurrenceMap,
          clientSeed: `${clientSeed}-free-spin-reel-rand-sym-generation`,
          serverSeed
        })
        freeGameSymbolOccurrenceMap = generateReelSymbolOccurrenceMapByPayWindow(payWindow)
      }

      const symbolOccurrenceResult = getFreeGameResultThroughPayWindowSymbolOccurrence({
        whichReelForMultiplier,
        clientSeed: `${clientSeed}-free-game-symbol-occurrence-result`,
        serverSeed,
        symbolOccurrenceMap: freeGameSymbolOccurrenceMap,
        isBuyFreeSpin,
        isAnteBet
      })

      const netMultiplier = symbolOccurrenceResult.netMultiplier
      const winningPayout = symbolOccurrenceResult.winningPayout
      const winningSymbol = symbolOccurrenceResult.winningSymbol
      const multiplierArray = symbolOccurrenceResult.multiplierArray
      const isCascading = symbolOccurrenceResult.isCascading

      const AWP = []
      payWindow.forEach((row) => {
        const arr = []
        row.forEach((symbol, index) => {
          if (freeGameSymbolOccurrenceMap.get(symbol) >= 8) {
            arr.push(index)
          }
        })
        AWP.push(arr)
      })

      const localWinningCombination = winningSymbol.reduce((acc, cv) => {
        acc[cv.sym] = cv.ct
        return acc
      }, {})

      unfinishedSlotGameBet.freeSpinWinningCombination = [
        ...unfinishedSlotGameBet.freeSpinWinningCombination,
        [
          {
            ...localWinningCombination,
            openedMultiplier: netMultiplier,
            openedPayout: winningPayout
          }
        ]
      ]

      const accumulatedMultiplier = getAccumulatedMultiplier(unfinishedSlotGameBet.freeSpinWinningCombination)
      // INFO: This netMultiplier is handled in each localWinningAmount, in free spin, MULT symbol not appears in cascade
      const localWinningAmount = times(winningPayout, betAmount)

      const R = convertPayWindowToString(payWindow, multiplierArray)

      // INFO: Adding base spin win amount to previous spins accumulated wins
      const showPayout = plus(+unfinishedSlotGameBet.winningAmount, +unfinishedSlotGameBet.freeSpinWinningAmount)

      if (!isCascading) {
        // INFO: This is case where there is not cascade in free spin
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
            AccWin: localWinningAmount,
            FreeSpin: {
              Current: totalFreeSpinsAwarded - +unfinishedSlotGameBet.freeSpinsLeft,
              Total: totalFreeSpinsAwarded
            },
            Result: {
              R,
              C: 1
            },
            // INFO: This is when the free spins loses, so netMultiplier is returned.
            Multiplier: netMultiplier,
            Round: {
              ...Current.Round,
              Payout: showPayout,
              AccMultiplier: accumulatedMultiplier,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}|${accumulatedMultiplier}|${showPayout}`
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
              amount: plus(+unfinishedSlotGameBet.freeSpinWinningAmount, +unfinishedSlotGameBet.winningAmount),
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
        // INFO: This is case where there is cascade in free spin
        const adjustedAccumulatedMultiplier = accumulatedMultiplier - (netMultiplier > 1 ? netMultiplier : 0)
        const response = {
          Player: unfinishedSlotGameBet.player,
          Current: {
            Type,
            TotalWin: localWinningAmount,
            AccWin: localWinningAmount,
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
            // INFO: This is when the free spins continues to cascade, so netMultiplier is returned.
            Multiplier: netMultiplier,
            Round: {
              ...Current.Round,
              Payout: showPayout,
              AccMultiplier: adjustedAccumulatedMultiplier,
              Items: [
                ...Current.Round.Items,
                `${Type}|${winningPayout}|${'1'}|${netMultiplier}|${adjustedAccumulatedMultiplier}|${showPayout}`
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
