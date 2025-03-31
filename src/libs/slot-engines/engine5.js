import _ from 'lodash'
import SlotBase from '@src/libs/slotBase'
import engineSettings from '@src/libs/slot-engines/data/engine5Settings'

class Engine5SlotGenerator extends SlotBase {
  /** @type {Reel[]} */
  #reelSets = []

  /** @type {Symbol[]} */
  #symbols = []

  /** @type {SymbolMultiplier} */
  #symbolMultiplier = {}

  /** @type {SymbolKeys} */
  #symbolKeys = {}

  /** @type {Patterns} */
  #patterns = []

  /** @type {WindowSize} */
  #windowSize = { width: 0, height: 0 }

  /** @type {SymbolIdMap} */
  #symbolIdMap = {}

  /** @type {number} */
  #minimumSymbolOccurrence = 2

  /** @type {string} */
  #clientSeed = ''

  /** @type {string} */
  #serverSeed = ''

  /** @type {number} */
  #betAmount = 1

  /** @type {boolean} */
  #isBuyFreeSpin = false

  /** @type {boolean} */
  #isBuyHoldAndSpinner = false

  /**
   * @param {WindowSize} windowSize
   * @param {Reel[]} reelSets
   * @param {Patterns} patterns
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reelSets, patterns, symbols, symbolKeys, symbolIdMap, symbolMultiplier }) {
    super()
    this.#reelSets = reelSets
    this.#patterns = patterns
    this.#windowSize = windowSize
    this.#symbolIdMap = symbolIdMap
    this.#symbolMultiplier = symbolMultiplier
    this.#symbols = symbols
    this.#symbolKeys = symbolKeys

    this.#validateData()
  }

  init ({ clientSeed, serverSeed, betAmount, isBuyFreeSpin = false, isBuyHoldAndSpinner = false }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
    this.#isBuyFreeSpin = isBuyFreeSpin
    this.#isBuyHoldAndSpinner = isBuyHoldAndSpinner
  }

  generate () {
    // const whichReelSet = 'BG'
    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-base-game-reel-set-selection`,
      serverSeed: this.#serverSeed,
      weightTable: { BG: 1 }
    })
    let payWindow = []
    let symbolOccurrence = {}
    let moneySymbolMultiplierMap = {}
    let fishSymbolMultiplierMap = {}
    if (this.#isBuyFreeSpin) {
      const payWindowIndex = (+(this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-buy-hold-and-spin-paywindow-selection`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.buyFreeSpinPayWindowSelection.weightTable
      }))) - 1

      payWindow = engineSettings.buyFreeSpinPayWindowSelection.payWindows[payWindowIndex]
      symbolOccurrence = { FG: (payWindowIndex + 3) }
    } else if (this.#isBuyHoldAndSpinner) {
      const payWindowIndex = (+(this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-buy-hold-and-spin-paywindow-selection`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.buyHoldAndSpinnerPayWindowSelection.weightTable
      }))) - 1

      payWindow = engineSettings.buyHoldAndSpinnerPayWindowSelection.payWindows[payWindowIndex]
      symbolOccurrence = { MO: (payWindowIndex + 3) }
      payWindow.forEach((reel, i) => {
        reel.forEach((symbol, j) => {
          if (symbol === this.#symbolKeys.MO) {
            moneySymbolMultiplierMap[[i, j]] = this.getRandomGenerationUsingWeightTable({
              clientSeed: `${this.#clientSeed}-buy-hold-and-spinner-money-multiplier-generation-${i}-${j}`,
              serverSeed: this.#serverSeed,
              weightTable: engineSettings.buyHoldAndSpinnerMoneySymbolMultiplierWeightTable
            })
          }
        })
      })
    } else {
      const generatedPayWindow = this.#generatePayWindow({
        reelSet: this.#reelSets[whichReelSet],
        clientSeed: `${this.#clientSeed}-base-game`,
        isFilterSymbolOccurrence: true,
        isSingleWild: false
      })
      payWindow = generatedPayWindow.payWindow
      symbolOccurrence = generatedPayWindow.symbolOccurrence
      moneySymbolMultiplierMap = generatedPayWindow.moneySymbolMultiplierMap
      fishSymbolMultiplierMap = generatedPayWindow.fishSymbolMultiplierMap
    }
    const isHoldAndSpinnerTriggered = symbolOccurrence[this.#symbolKeys.MO] >= 3
    const isFreeGameTriggered = symbolOccurrence[this.#symbolKeys.FG] >= 3
    const result = this.#checkPatterns({ payWindow, symbolsToCheck: [...engineSettings.valueSymbols, this.#symbolKeys.FS] })

    const returnObj = {
      baseGameDetails: {
        result,
        payWindow,
        moneySymbolMultiplierMap,
        fishSymbolMultiplierMap
      },
      holdAndSpinnerDetails: {
        isHoldAndSpinnerTriggered,
        baseHoldAndSpinnerResult: [],
        spinsLeft: 0
      },
      freeGameDetails: {
        isFreeGameTriggered,
        freeSpinsGameResult: [],
        freeSpinsAwarded: 0
      }
    }

    if (isHoldAndSpinnerTriggered && !isFreeGameTriggered) {
      // Generate all hold and spinner
      const { baseHoldAndSpinnerResult } = this.#generateHoldAndSpin({
        payWindow,
        moneySymbolMultiplierMap
      })
      returnObj.holdAndSpinnerDetails.baseHoldAndSpinnerResult = baseHoldAndSpinnerResult
      returnObj.holdAndSpinnerDetails.spinsLeft = engineSettings.defaultSpinsInHoldAndSpinner
    } else if (isFreeGameTriggered) {
      const freeSpinsAwarded = engineSettings.freeSpinsAwarded[symbolOccurrence[this.#symbolKeys.FG] > 5 ? 5 : symbolOccurrence[this.#symbolKeys.FG]]
      const { freeSpinsGameResult } = this.#generateFreeGame({
        freeSpins: freeSpinsAwarded
      })
      returnObj.freeGameDetails.freeSpinsGameResult = freeSpinsGameResult
      returnObj.freeGameDetails.freeSpinsAwarded = freeSpinsAwarded
    }

    return returnObj
  }

  #generateHoldAndSpin ({
    payWindow,
    moneySymbolMultiplierMap
  }) {
    let reSpins = engineSettings.defaultSpinsInHoldAndSpinner

    const initialFixedMap = moneySymbolMultiplierMap

    const baseHoldAndSpinnerResult = [{
      spinsLeft: reSpins,
      Result: {
        R: this.#getR(payWindow),
        money: {
          toCollect: true,
          moneySymbolMultiplierMap: {
            initialFixedMap,
            newWinningsMap: {}
          }
        }
      },
      payout: (+(Object.values(initialFixedMap).reduce((acc, cv) => {
        return acc + (+cv)
      }, 0))) * this.#betAmount
    }]

    for (let iteration = 0; reSpins > 0; iteration++) {
      reSpins -= 1

      let payout = 0

      const baseHoldAndSpinnerGeneratedPayWindowResult = this.#generateBaseHoldAndSpinPayWindow({
        payWindow,
        iteration,
        moneySymbolMultiplierMap: initialFixedMap
      })

      if (baseHoldAndSpinnerGeneratedPayWindowResult.isNewMoneySymbol) {
        reSpins = engineSettings.defaultSpinsInHoldAndSpinner
        payout = (+(Object.values(baseHoldAndSpinnerGeneratedPayWindowResult.moneySymbolMultiplierMap).reduce((acc, cv) => {
          return acc + (+cv)
        }, 0))) * this.#betAmount
      }

      baseHoldAndSpinnerResult.push({
        spinsLeft: reSpins,
        Result: {
          R: this.#getR(baseHoldAndSpinnerGeneratedPayWindowResult.payWindow),
          money: {
            toCollect: baseHoldAndSpinnerGeneratedPayWindowResult.isNewMoneySymbol,
            moneySymbolMultiplierMap: {
              initialFixedMap,
              newWinningsMap: Object.keys(baseHoldAndSpinnerGeneratedPayWindowResult.moneySymbolMultiplierMap).filter(key => !(key in initialFixedMap)).reduce((acc, cv) => {
                acc[cv] = baseHoldAndSpinnerGeneratedPayWindowResult.moneySymbolMultiplierMap[cv]
                return acc
              }, {})
            }
          }
        },
        payout
      })
    }

    return {
      baseHoldAndSpinnerResult
    }
  }

  #generateFreeGame ({
    freeSpins
  }) {
    let freeSpinsLeft = freeSpins
    let featureMultiplier = 1
    let wildCollected = 0
    const freeSpinsGameResult = []
    const bazookaDetails = {
      isBazooka: false,
      bazookaPayWindow: [],
      bazookaFishSymbolMultiplierMap: {}
    }

    for (let i = 0; freeSpinsLeft > 0; i++) {
      const whichReelSet = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-free-game-reel-selection-${i}`,
        serverSeed: this.#serverSeed,
        weightTable: this.#isBuyFreeSpin ? engineSettings.buyFreeGameReelSetWeightTable : engineSettings.freeGameReelSetWeightTable
      })
      let payout = 0
      let moreAwarded = 0
      let isWildCollected = false
      let fr = null
      let wildPosition = ''
      freeSpinsLeft -= 1
      const freeGameGeneratedPayWindow = this.#generatePayWindow({
        reelSet: this.#reelSets[whichReelSet],
        clientSeed: `${this.#clientSeed}-free-game-reel-generation-iteration-${i + 1}`,
        isFilterSymbolOccurrence: false,
        isSingleWild: true
      })

      const result = this.#checkPatterns({
        payWindow: freeGameGeneratedPayWindow.payWindow,
        symbolsToCheck: [...engineSettings.valueSymbols, this.#symbolKeys.FS]
      })

      if (freeGameGeneratedPayWindow.symbolOccurrence[this.#symbolKeys.WD] > 0) {
        freeGameGeneratedPayWindow.payWindow.forEach((reel, i) => {
          reel.forEach((symbol, j) => {
            if (symbol === this.#symbolKeys.WD) {
              wildPosition = `${i},${j}`
            }
          })
        })
      }

      if (freeGameGeneratedPayWindow.symbolOccurrence[this.#symbolKeys.WD] > 0 && freeGameGeneratedPayWindow.symbolOccurrence[this.#symbolKeys.FS] > 0) {
        const payoutCollectedWithWild = +(Object.values(freeGameGeneratedPayWindow.fishSymbolMultiplierMap).reduce((acc, cv) => {
          return acc + (+cv)
        }, 0))

        payout += (payoutCollectedWithWild * featureMultiplier * this.#betAmount)

        wildCollected += 1
        isWildCollected = true
        if (wildCollected % 4 === 0) {
          if (wildCollected <= 12) {
            featureMultiplier = engineSettings.wildCollectedMultipliers[wildCollected]
            freeSpinsLeft += 10
            moreAwarded = 10
          }
        }
      } else if (freeGameGeneratedPayWindow.symbolOccurrence[this.#symbolKeys.WD] > 0 && freeGameGeneratedPayWindow.symbolOccurrence[this.#symbolKeys.FS] === 0) {
        const bazookaResult = this.#generateBazookaPayWindow({
          payWindow: freeGameGeneratedPayWindow.payWindow,
          iteration: i
        })

        const payoutCollectedWithWild = +(Object.values(bazookaResult.fishSymbolMultiplierMap).reduce((acc, cv) => {
          return acc + (+cv)
        }, 0))

        payout += (payoutCollectedWithWild * featureMultiplier * this.#betAmount)

        wildCollected += 1
        isWildCollected = true
        if (wildCollected % 4 === 0) {
          if (wildCollected <= 12) {
            featureMultiplier = engineSettings.wildCollectedMultipliers[wildCollected]
            freeSpinsLeft += 10
            moreAwarded = 10
          }
        }

        bazookaDetails.bazookaPayWindow = bazookaResult.payWindow
        bazookaDetails.isBazooka = true
        bazookaDetails.bazookaFishSymbolMultiplierMap = bazookaResult.fishSymbolMultiplierMap
      } else {
        const { formattedResult, totalPayout } = this.formatResult({
          result,
          payWindow: freeGameGeneratedPayWindow.payWindow
        })

        payout += totalPayout

        fr = {
          WR: formattedResult.WR
        }
      }

      const mainPayWindowR = this.#getR(freeGameGeneratedPayWindow.payWindow)

      const hookDetails = {
        isHook: false,
        reelIndex: 0,
        oldReel: '',
        newReel: '',
        beforeHookR: ''
      }

      if (!isWildCollected && !bazookaDetails.isBazooka) {
        const hook = this.getRandomGenerationUsingWeightTable({
          clientSeed: `${this.#clientSeed}-free-game-hook-trigger-${i + 1}`,
          serverSeed: this.#serverSeed,
          weightTable: engineSettings.hookTriggerDecisionWeightTable
        })

        hookDetails.isHook = hook === engineSettings.glossaryTerms.YES
        hookDetails.oldReel = this.getRandomGenerationUsingWeightTable({
          clientSeed: `${this.#clientSeed}-free-game-hook-select-old-reel-${i + 1}`,
          serverSeed: this.#serverSeed,
          weightTable: engineSettings.hookTriggerOldReelSelectionWeightTable
        })
        hookDetails.reelIndex = this.generateRandomNumber({
          clientSeed: `${this.#clientSeed}-free-game-hook-select-old-reel-${i + 1}`,
          serverSeed: this.#serverSeed,
          maxNumber: this.#windowSize.width
        }) - 1

        hookDetails.beforeHookR = mainPayWindowR.split('|').map((reel, index) => {
          if (index === hookDetails.reelIndex) {
            hookDetails.newReel = reel
            return hookDetails.oldReel
          }
          return reel
        }).join('|')
      }

      freeSpinsGameResult.push({
        freeSpinsLeft,
        moreAwarded,
        Result: {
          R: this.#getR(freeGameGeneratedPayWindow.payWindow),
          ...(fr && payout !== 0
            ? {
                WR: fr.WR
              }
            : {}),
          bazooka: {
            active: bazookaDetails.isBazooka,
            R: this.#getR(bazookaDetails.bazookaPayWindow)
          },
          wild: {
            toCollect: isWildCollected,
            collectedCount: wildCollected,
            fishSymbolMultiplierMap: bazookaDetails.isBazooka ? bazookaDetails.bazookaFishSymbolMultiplierMap : freeGameGeneratedPayWindow.fishSymbolMultiplierMap,
            position: wildPosition,
            featureMultiplier
          },
          hook: {
            active: hookDetails.isHook,
            ...(hookDetails.isHook
              ? {
                  beforeHookR: hookDetails.beforeHookR,
                  details: [
                    {
                      reelIndex: hookDetails.reelIndex,
                      newReel: hookDetails.newReel
                    }
                  ]
                }
              : {})
          }
        },
        payout
      })
    }

    return {
      freeSpinsGameResult
    }
  }

  #generateBazookaPayWindow ({
    payWindow,
    iteration
  }) {
    const symbolOccurrence = {}
    const fishSymbolMultiplierMap = {}
    const _newPayWindow = payWindow.map((reel, i) => {
      return reel.map((symbol, j) => {
        let returnedSymbol = symbol
        if (symbol !== this.#symbolKeys.WD) {
          returnedSymbol = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${this.#clientSeed}-free-game-bazooka-${iteration}-${i}-${j}`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.bazookaPayWindowSymbolWeightTable
          })
        }
        if (returnedSymbol === this.#symbolKeys.FS) {
          fishSymbolMultiplierMap[[i, j]] = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${this.#clientSeed}-free-game-fish-multiplier-generation-${i}-${j}`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.fishSymbolMultiplierWeightTable
          })
        }
        symbolOccurrence[returnedSymbol] = (symbolOccurrence[returnedSymbol] ?? 0) + 1

        return returnedSymbol
      })
    })

    return {
      symbolOccurrence,
      payWindow: _newPayWindow,
      fishSymbolMultiplierMap
    }
  }

  #generatePayWindow ({
    reelSet,
    clientSeed,
    isFilterSymbolOccurrence,
    isSingleWild = false
  }) {
    const payWindow = []
    let symbolOccurrence = {}
    const moneySymbolMultiplierMap = {}
    const fishSymbolMultiplierMap = {}

    for (let i = 0; i < this.#windowSize.width; i++) {
      const reel = reelSet[i]

      const randIndex = this.generateRandomNumber({
        clientSeed: `${clientSeed}-reel-number-${i}`,
        serverSeed: this.#serverSeed,
        maxNumber: reel.length
      }) - 1

      const subReel = []
      for (let j = 0; j < this.#windowSize.height; j++) {
        let symbol = reel[(randIndex + j) % reel.length]

        if (isSingleWild) {
          if (symbolOccurrence[this.#symbolKeys.WD] === 1 && symbol === this.#symbolKeys.WD) {
            symbol = this.getRandomGenerationUsingWeightTable({
              clientSeed: `${this.#clientSeed}-single-wild-${i}-${j}`,
              serverSeed: this.#serverSeed,
              weightTable: engineSettings.bazookaPayWindowSymbolWeightTable
            })
          }
        }

        _.isNumber(symbolOccurrence[symbol]) ? symbolOccurrence[symbol]++ : symbolOccurrence[symbol] = 1
        if (symbol === this.#symbolKeys.MO) {
          moneySymbolMultiplierMap[[i, j]] = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-money-multiplier-generation-${i}-${j}`,
            serverSeed: this.#serverSeed,
            weightTable: this.#isBuyHoldAndSpinner
              ? engineSettings.buyHoldAndSpinnerMoneySymbolMultiplierWeightTable
              : engineSettings.moneySymbolMultiplierWeightTable
          })
        } else if (symbol === this.#symbolKeys.FS) {
          fishSymbolMultiplierMap[[i, j]] = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-fish-multiplier-generation-${i}-${j}`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.fishSymbolMultiplierWeightTable
          })
        }

        subReel.push(symbol)
      }

      payWindow.push(subReel)
    }

    // filter symbols which count >= minSymbolNeeded
    if (isFilterSymbolOccurrence) {
      symbolOccurrence = Object.entries(symbolOccurrence)
        .filter(([key, value]) => value >= this.#minimumSymbolOccurrence)
        .reduce((acc, [key, value]) => {
          acc[key] = value
          return acc
        }, {})
    }

    return {
      payWindow,
      symbolOccurrence,
      moneySymbolMultiplierMap,
      fishSymbolMultiplierMap
    }
  }

  #generateBaseHoldAndSpinPayWindow ({
    payWindow,
    iteration,
    moneySymbolMultiplierMap
  }) {
    const symbolOccurrenceMap = {}
    const _moneySymbolMultiplierMap = {
      ...moneySymbolMultiplierMap
    }
    // const whichReelSet = 'BGHR'
    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-base-hold-and-spin-reel-set-generation-${iteration}`,
      serverSeed: this.#serverSeed,
      weightTable: this.#isBuyHoldAndSpinner ? { BGHR: 1, FGHR: 0.8, BG: 0.2 } : { BGHR: 1.5, FGHR: 1.5 }
    })
    const baseHoldAndSpinnerGeneratedPayWindow = this.#generatePayWindow({
      reelSet: this.#reelSets[whichReelSet],
      clientSeed: `${this.#clientSeed}-base-game-hold-and-spin-${iteration}`,
      isFilterSymbolOccurrence: true,
      isSingleWild: false
    })
    let isNewMoneySymbol = false

    const _newPayWindow = baseHoldAndSpinnerGeneratedPayWindow.payWindow.map((reel, i) => {
      return reel.map((symbol, j) => {
        const returnedSymbol = payWindow[i][j] === this.#symbolKeys.MO ? payWindow[i][j] : symbol

        if (payWindow[i][j] !== this.#symbolKeys.MO && symbol === this.#symbolKeys.MO) {
          _moneySymbolMultiplierMap[[i, j]] = baseHoldAndSpinnerGeneratedPayWindow.moneySymbolMultiplierMap[[i, j]]
          isNewMoneySymbol = true
        }

        symbolOccurrenceMap[returnedSymbol] = ((symbolOccurrenceMap[returnedSymbol] ?? 0) + 1)

        return returnedSymbol
      })
    })

    return {
      moneySymbolMultiplierMap: _moneySymbolMultiplierMap,
      payWindow: _newPayWindow,
      isNewMoneySymbol
    }
  }

  /**
   * @param {PayWindow} payWindow
   * @param {Object.<string, number>} symbolOccurrence
   * @returns
   */
  #checkPatterns ({
    payWindow,
    symbolsToCheck
  }) {
    const result = []
    const transposedFlatPayWindow = this.transpose(payWindow).flat()
    Object.keys(this.#patterns).forEach(patternNumber => {
      for (const symbol of symbolsToCheck) {
        // Left to Right match
        const matchedData = this.#patternMatched({ symbol, transposedFlatPayWindow, patternNumber, payDirection: engineSettings.payDirection.leftToRight })

        if (matchedData.matched) result.push(matchedData)
      }
    })

    return result
  }

  #patternMatched ({ symbol, transposedFlatPayWindow, patternNumber, payDirection }) {
    const pattern = payDirection === engineSettings.payDirection.leftToRight ? this.#patterns[patternNumber] : [...this.#patterns[patternNumber]].reverse()
    const matchedPatternIndexes = []

    for (const index in pattern) {
      if (transposedFlatPayWindow[pattern[index]] !== symbol) break
      matchedPatternIndexes.push(Math.floor(pattern[index] / this.#windowSize.width))
    }

    return {
      symbol,
      patternNumber,
      payDirection,
      matchedPatternIndexes,
      pattern: this.#patterns[patternNumber],
      matched: matchedPatternIndexes.length >= this.#minimumSymbolOccurrence
    }
  }

  #validateData () {
    Object.keys(this.#reelSets).forEach(reelSet => {
      if (this.#windowSize.width !== this.#reelSets[reelSet].length) throw Error('Window width and number of reels mismatch')
      this.#reelSets[reelSet].forEach(reel => {
        reel.forEach(symbol => {
          if (!this.#symbols.includes(symbol)) throw Error(`Symbol map does not contain reel symbol ${symbol}`)
        })
      })
    })
  }

  formatResult ({ result, payWindow }) {
    let totalPayout = 0

    const formattedResult = {
      R: this.#getR(payWindow)
    }

    if (!result.length) return { formattedResult, totalPayout }

    const wr = {
      R: '',
      AWP: Array.from({ length: this.#windowSize.width }, () => new Set()),
      Details: []
    }

    result.forEach(winResult => {
      const totalSymbolMatched = winResult.matchedPatternIndexes.length
      const coinPayout = this.getPrecision(this.#betAmount * (this.#symbolMultiplier[winResult.symbol][totalSymbolMatched]))
      totalPayout = this.getPrecision(coinPayout + totalPayout)

      if (coinPayout !== 0) {
        winResult.matchedPatternIndexes.forEach((value, index) => wr.AWP[index].add(value))

        wr.R += `${coinPayout},${winResult.patternNumber},${totalSymbolMatched},${this.#symbolIdMap[winResult.symbol]}|`

        wr.Details.push({
          pattern: this.#patterns[winResult.patternNumber],
          payout: coinPayout,
          matched: totalSymbolMatched,
          symbol: this.#symbolIdMap[winResult.symbol]
        })
      }
    })

    wr.AWP = wr.AWP.map(data => [...data])
    wr.R = wr.R.substring(0, wr.R.length - 1)

    formattedResult.WR = [wr]

    return { formattedResult, totalPayout: this.getPrecision(totalPayout) }
  }

  #getR (payWindow) {
    let R = payWindow.flat().reduce((prev, symbol, index) => {
      prev += this.#symbolIdMap[symbol] + ((index % this.#windowSize.height) >> 0 === 2 ? '|' : ',')
      return prev
    }, '')

    R = R.substring(0, R.length - 1)

    return R
  }
}

const engine5 = new Engine5SlotGenerator({
  windowSize: { height: engineSettings.rows, width: engineSettings.reels },
  reelSets: engineSettings.reelSets,
  patterns: engineSettings.patterns,
  symbols: engineSettings.symbols,
  symbolKeys: engineSettings.symbolKeys,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier
})

export default engine5
