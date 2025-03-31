import _ from 'lodash'
import SlotBase from '@src/libs/slotBase'
import engineSettings from '@src/libs/slot-engines/data/engine11Settings'

class WaysSlotGenerator extends SlotBase {
  /** @type {Reel} */
  #reels = {}

  /** @type {Symbol[]} */
  #symbols = []

  /** @type {SymbolMultiplier} */
  #symbolMultiplier = {}

  // INFO: Here height means number of rows and width means number of reels
  /** @type {WindowSize} */
  #windowSize = { width: 0, height: 0 }

  /** @type {SymbolIdMap} */
  #symbolIdMap = {}

  /** @type {string} */
  #clientSeed = ''

  /** @type {string} */
  #serverSeed = ''

  /** @type {string} */
  #betAmount = 1

  /**
   * @param {WindowSize} windowSize
   * @param {Reel[]} reels
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reels, symbolIdMap, symbolMultiplier, symbols }) {
    super()
    this.#reels = reels
    this.#windowSize = windowSize
    this.#symbolIdMap = symbolIdMap
    this.#symbolMultiplier = symbolMultiplier
    this.#symbols = symbols

    this.#validateData()
  }

  #validateData () {
    Object.keys(this.#reels).forEach(reelNumber => {
      if (this.#windowSize.width !== this.#reels[reelNumber].length) throw Error('Window width and number of reels mismatch')
      this.#reels[reelNumber].forEach(reel => {
        reel.forEach(symbol => {
          if (!this.#symbols.includes(symbol)) throw Error(`Symbol map does not contain reel symbol ${symbol}`)
        })
      })
    })
  }

  init ({ clientSeed, serverSeed, betAmount }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
  }

  generate ({
    isBuyFreeSpin
  }) {
    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-select-reel`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.baseGameReelWeights
    })

    let {
      payWindow,
      multiplierMap,
      symbolOccurrence
    } = this.#generatePayWindow({
      reelSet: this.#reels[whichReelSet],
      clientSeed: `${this.#clientSeed}-base-game`,
      stackReplacementWeightTable: engineSettings.baseGameStackSymbolsReplacementWeight,
      multipliersTable: engineSettings.baseGameMultiplierWeightsForWild
    })

    if (isBuyFreeSpin) {
      const howManyScatterTrigger = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-buy-free-spin`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.buyFreeGameScatterTriggerWeights
      })
      payWindow = engineSettings.scatterPayWindows[howManyScatterTrigger]
      multiplierMap = {}
      symbolOccurrence = {
        [engineSettings.symbolKeys.SCATTER]: +howManyScatterTrigger
      }
    }

    const waysCombinations = this.#generateWaysCombinationForAllSymbols({
      payWindow
    })

    const scatterCount = symbolOccurrence[engineSettings.symbolKeys.SCATTER] || 0
    const isFreeGameTriggered = scatterCount >= 3

    const allFreeSpinDetails = []
    let freeSpinsAwarded = 0
    let initialFreeSpinsAwarded = 0

    if (isFreeGameTriggered) {
      freeSpinsAwarded = engineSettings.freeSpinsAwarded[scatterCount]
      initialFreeSpinsAwarded = freeSpinsAwarded

      for (let i = 0; i < freeSpinsAwarded; i++) {
        const freeSpinResult = this.#runFreeGame({
          iteration: i + 1,
          isBuyFreeSpin
        })
        let newFreeSpinsAwarded = 0
        if (freeSpinResult.symbolOccurrence[engineSettings.symbolKeys.SCATTER] >= 2) {
          newFreeSpinsAwarded = engineSettings.freeSpinsAwarded[freeSpinResult.symbolOccurrence[engineSettings.symbolKeys.SCATTER]]
          freeSpinsAwarded += newFreeSpinsAwarded
        }
        allFreeSpinDetails.push({
          newFreeSpinsAwarded,
          scatterCount: freeSpinResult.symbolOccurrence[engineSettings.symbolKeys.SCATTER],
          ...freeSpinResult
        })
      }
    }

    return {
      baseGameDetails: {
        payWindow,
        waysCombinations,
        multiplierMap,
        scatterCount
      },
      freeGameDetails: {
        allFreeSpinDetails,
        isFreeGameTriggered,
        freeSpinsAwarded: initialFreeSpinsAwarded
      }
    }
  }

  formatResult ({
    payWindow,
    waysCombinations,
    multiplierMap
  }) {
    // For RTP Matching

    let totalPayout = 0

    const symbolWins = Object.keys(waysCombinations)

    const WR = []

    for (const i of symbolWins) {
      const waysForSymbol = waysCombinations[i]

      waysForSymbol.forEach(way => {
        let _wayPayout = 0
        _wayPayout = (this.#symbolMultiplier[i][way.length])

        let netMultiplier = 0

        way.forEach(position => {
          const x = +position.split('-')[0]
          const y = +position.split('-')[1]
          const symbol = payWindow[x][y]
          if (symbol === engineSettings.symbolKeys.WILD) {
            const multiplier = +multiplierMap[[x, y]]
            netMultiplier += (multiplier === 1 ? 0 : multiplier)
          } else if (symbol === engineSettings.symbolKeys['2xWILD']) {
            const multiplier = +multiplierMap[[x, y]]
            netMultiplier += (multiplier === 1 ? 0 : multiplier)
            _wayPayout *= 2
          } else if (symbol === engineSettings.symbolKeys[`2x${i}`]) {
            _wayPayout *= 2
          }
        })

        netMultiplier = (netMultiplier === 0 ? 1 : netMultiplier)
        if (_wayPayout > 0) {
          WR.push({
            symbol: i,
            wayPayout: this.getPrecision(_wayPayout * this.#betAmount),
            way,
            multiplier: netMultiplier
          })
        }
        _wayPayout = (_wayPayout * netMultiplier)
        totalPayout += _wayPayout
      })
    }

    totalPayout *= this.#betAmount

    const R = payWindow.map(row => {
      return row.map(symbol => {
        return this.#symbolIdMap[symbol]
      })
    }).map(row => row.join(',')).join('|')

    return {
      formattedResult: {
        R,
        WR
      },
      totalPayout: this.getPrecision(totalPayout)
    }
  }

  #getReplacingSymbolWithWeightTable ({
    clientSeed,
    serverSeed,
    weightTable
  }) {
    let _newValueSymbol
    if (Object.keys(weightTable).length > 0) {
      const generatedSymbol = this.getRandomGenerationUsingWeightTable({
        weightTable,
        clientSeed,
        serverSeed
      })
      _newValueSymbol = generatedSymbol
    } else {
      const valueSymbols = engineSettings.valueSymbols
      const index = this.generateRandomNumber({
        clientSeed: `${this.#clientSeed}-equal-weights`,
        serverSeed: this.#serverSeed,
        maxNumber: valueSymbols
      }) - 1
      const generatedSymbol = valueSymbols[index]
      _newValueSymbol = generatedSymbol
    }

    return _newValueSymbol
  }

  #generatePayWindow ({
    reelSet,
    clientSeed,
    stackReplacementWeightTable,
    multipliersTable
  }) {
    const payWindow = []
    const multiplierMap = {}
    const symbolOccurrence = {}

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
        if (symbol === engineSettings.symbolKeys.STACK || symbol === engineSettings.symbolKeys['2xSTACK']) {
          symbol = this.#getReplacingSymbolWithWeightTable({
            clientSeed: `${clientSeed}-reel-${i + 1}-${j + 1}`,
            serverSeed: this.#serverSeed,
            weightTable: stackReplacementWeightTable?.[symbol]?.[i] || {}
          })
        }

        _.isNumber(symbolOccurrence[symbol]) ? symbolOccurrence[symbol]++ : (symbolOccurrence[symbol] = 1)
        subReel.push(symbol)

        if (symbol === engineSettings.symbolKeys.WILD) {
          const _multiplierForWild = +(this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-spin-multipliers-WILD-${i + 1}-${j + 1}`,
            serverSeed: this.#serverSeed,
            weightTable: multipliersTable
          }))
          multiplierMap[[i, j]] = _multiplierForWild
        } else if (symbol === engineSettings.symbolKeys['2xWILD']) {
          let totalMultiplier = 0
          for (let k = 0; k < 2; k++) {
            const _multiplierForWild = +(this.getRandomGenerationUsingWeightTable({
              clientSeed: `${clientSeed}-spin-multipliers-2xWILD-${i + 1}-${j + 1}-${k + 1}`,
              serverSeed: this.#serverSeed,
              weightTable: multipliersTable
            }))
            totalMultiplier += (_multiplierForWild === 1 ? 0 : _multiplierForWild)
          }
          multiplierMap[[i, j]] = +(totalMultiplier === 0 ? 1 : totalMultiplier)
        }
      }

      payWindow.push(subReel)
    }

    return {
      payWindow,
      multiplierMap,
      symbolOccurrence
    }
  }

  #generateWaysCombinationForAllSymbols ({
    payWindow
  }) {
    const singleSymbols = engineSettings.singleSymbols

    const waysCombinations = {}

    for (const i of singleSymbols) {
      const { cartesianProduct } = this.#analyzeWaysCombinationForSingleSymbol({
        payWindow,
        singleSymbol: i
      })

      if (cartesianProduct.length > 0) {
        waysCombinations[i] = cartesianProduct
      }
    }

    return waysCombinations
  }

  #analyzeWaysCombinationForSingleSymbol ({
    payWindow,
    singleSymbol
  }) {
    const doubleSymbol = `2x${singleSymbol}`
    const agnosticSymbols = [engineSettings.symbolKeys.WILD, engineSettings.symbolKeys['2xWILD']]

    const filteredPayWindow = []

    const relevantSymbolCountReelWise = payWindow.map((reel, reelIndex) => {
      const filteredReel = []
      const count = reel.reduce((acc, cv, symbolIndex) => {
        const isRelevantSymbol = [singleSymbol, doubleSymbol, ...agnosticSymbols].includes(cv)
        if (isRelevantSymbol) {
          filteredReel.push(`${reelIndex}-${symbolIndex}`)
        }
        return acc + (isRelevantSymbol ? 1 : 0)
      }, 0)

      filteredPayWindow.push(filteredReel)

      return count
    })

    let consecutiveSymbolOccurrence = 0

    for (let i = 0; i < this.#windowSize.width; i++) {
      if (relevantSymbolCountReelWise[i] > 0) {
        consecutiveSymbolOccurrence += 1
      } else {
        break
      }
    }

    const ways = []

    if (consecutiveSymbolOccurrence < engineSettings.minimumConsecutiveSymbolOccurrence) {
      return {
        cartesianProduct: ways
      }
    }

    const totalNumberOfWays = relevantSymbolCountReelWise.slice(0, consecutiveSymbolOccurrence).reduce((acc, cv) => { return acc * (cv > 0 ? cv : 1) }, 1)

    const symbolPositionsToConsiderForWays = filteredPayWindow.slice(0, consecutiveSymbolOccurrence)

    const cartesianProduct = this.cartesianProductOfArrays(...symbolPositionsToConsiderForWays)

    if (totalNumberOfWays !== cartesianProduct.length) {
      console.log('totalNumberOfWays is Wrong')
    }

    return {
      cartesianProduct
    }
  }

  #runFreeGame ({
    iteration,
    isBuyFreeSpin
  }) {
    const whichFreeGameReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-select-reel-free-game-${iteration}`,
      serverSeed: this.#serverSeed,
      weightTable: isBuyFreeSpin ? engineSettings.buyFreeGameReelWeights : engineSettings.freeGameReelWeights
    })

    const {
      payWindow,
      multiplierMap,
      symbolOccurrence
    } = this.#generatePayWindow({
      reelSet: this.#reels[whichFreeGameReelSet],
      clientSeed: `${this.#clientSeed}-free-game-${iteration}`,
      stackReplacementWeightTable: engineSettings.freeGameStackSymbolsReplacementWeight,
      multipliersTable: isBuyFreeSpin ? engineSettings.buyFreeGameMultiplierWeightsForWild : engineSettings.freeGameMultiplierWeightsForWild
    })

    const waysCombinations = this.#generateWaysCombinationForAllSymbols({
      payWindow
    })

    return {
      payWindow,
      multiplierMap,
      symbolOccurrence,
      waysCombinations
    }
  }
}

const engine11 = new WaysSlotGenerator({
  // INFO: Here height means number of rows and width means number of reels
  windowSize: { height: 4, width: 5 },
  reels: engineSettings.reels,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbols: engineSettings.symbols
})

export default engine11
