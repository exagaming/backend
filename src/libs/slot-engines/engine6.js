import _ from 'lodash'
import SlotBase from '@src/libs/slotBase'
import engineSettings from '@src/libs/slot-engines/data/engine6Settings'

class Engine6Generator extends SlotBase {
  /** @type {Reel} */
  #reelSets = {}

  /** @type {Symbol[]} */
  #symbols = []

  /** @type {SymbolMultiplier} */
  #symbolMultiplier = {}

  // INFO: Here height means number of rows and width means number of reels
  /** @type {WindowSize} */
  #windowSize = { width: 0, height: 0 }

  /** @type {SymbolIdMap} */
  #symbolIdMap = {}

  /** @type {SymbolKeys} */
  #symbolKeys = {}

  /** @type {string} */
  #clientSeed = ''

  /** @type {string} */
  #serverSeed = ''

  /** @type {number} */
  #betAmount = 1

  /** @type {boolean} */
  #isBuyFreeSpin = false

  /** @type {Array[][]} */
  #neighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]]

  /**
   * @param {WindowSize} windowSize
   * @param {object} reelSets
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reelSets, symbolIdMap, symbolMultiplier, symbols, symbolKeys }) {
    super()
    this.#reelSets = reelSets
    this.#windowSize = windowSize
    this.#symbolKeys = symbolKeys
    this.#symbolIdMap = symbolIdMap
    this.#symbolMultiplier = symbolMultiplier
    this.#symbols = symbols

    this.#validateData()
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

  init ({ clientSeed, serverSeed, betAmount, isBuyFreeSpin }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
    this.#isBuyFreeSpin = isBuyFreeSpin
  }

  generate () {
    const {
      allBaseGameDetails,
      isFreeGameTriggered,
      freeSpinsAwarded,
      scatterCount
    } = this.#runBaseGame()

    const allFreeSpinDetails = []

    if (isFreeGameTriggered) {
      let freeSpinsToRun = freeSpinsAwarded
      let collectiveMultiplierMap = {}
      let freeSpinSessionTotalPayout = 0

      for (let i = 0; i < freeSpinsToRun; i++) {
        const freeSpinResult = this.#runFreeGame({
          iteration: i + 1,
          collectiveMultiplierMap,
          freeSpinSessionTotalPayout
        })

        collectiveMultiplierMap = { ...freeSpinResult.newCollectiveMultiplierMap }

        const additionalFreeSpinsAwarded = freeSpinResult.additionalFreeSpinsAwarded
        if (additionalFreeSpinsAwarded > 0) {
          freeSpinsToRun += additionalFreeSpinsAwarded
        }
        freeSpinSessionTotalPayout += freeSpinResult.freeSpinPayout

        allFreeSpinDetails.push({
          tumbleDetails: freeSpinResult.tumbleDetails,
          additionalFreeSpinsAwarded,
          scatterCount: freeSpinResult.scatterCount,
          freeSpinPayout: freeSpinResult.freeSpinPayout
        })
      }
    }

    return {
      baseGameDetails: {
        allBaseGameDetails,
        scatterCount
      },
      freeGameDetails: {
        allFreeSpinDetails,
        isFreeGameTriggered,
        freeSpinsAwarded
      }
    }
  }

  formatResult ({
    payWindow,
    clusterDetails,
    isScatter
  }) {
    const formattedResult = {
      R: this.#getR(payWindow),
      clusterDetails: clusterDetails.map(detail => {
        return {
          ...detail,
          symbol: this.#symbolIdMap[detail.symbol]
        }
      })
    }

    if (isScatter) {
      const positions = []
      payWindow.forEach((reel, reelIndex) => {
        reel.forEach((symbol, symbolIndex) => {
          if (symbol === this.#symbolKeys.SC) {
            const position = this.#getPositionString({
              reelIndex,
              symbolIndex
            })
            positions.push(position)
          }
        })
      })
      const scatter = {
        payout: 0,
        symbol: this.#symbolIdMap[this.#symbolKeys.SC],
        positions
      }

      formattedResult.scatter = { ...scatter }
    }

    return {
      formattedResult
    }
  }

  #getR (payWindow) {
    const R = payWindow.map(row => {
      return row.map(symbol => {
        return this.#symbolIdMap[symbol]
      })
    }).map(row => row.join(',')).join('|')

    return R
  }

  #runBaseGame () {
    const allBaseGameDetails = []
    let freeSpinsAwarded = 0
    let isFreeGameTriggered = false
    let multiplierMap = {}

    let payWindow = []
    let symbolOccurrence = {}

    if (this.#isBuyFreeSpin) {
      const payWindowSelectedIndex = (+(this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-buy-free-game-paywindow-selection-index`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.buyFreeSpinsPayWindowSelection.weightTable
      }))) - 1

      payWindow = engineSettings.buyFreeSpinsPayWindowSelection.payWindows[payWindowSelectedIndex]

      payWindow.forEach(reel => {
        reel.forEach(symbol => {
          symbolOccurrence[symbol] = (symbolOccurrence[symbol] ?? 0) + 1
        })
      })
    } else {
      const _generatedBGPayWindow = this.#generateBGPayWindow()
      payWindow = _generatedBGPayWindow.payWindow
      symbolOccurrence = _generatedBGPayWindow.symbolOccurrence
    }

    const scatterCount = symbolOccurrence[this.#symbolKeys.SC] || 0

    if (scatterCount >= 3) {
      isFreeGameTriggered = true
      freeSpinsAwarded = engineSettings.freeSpinsAwardedForScatters[scatterCount > 7 ? 7 : scatterCount]
    }

    let isNextTumble

    let tumbleNo = 0

    do {
      const { clusterDetails, totalPayout, newMultiplierMap } = this.#evaluateClusters({
        payWindow,
        multiplierMap
      })

      isNextTumble = (totalPayout > 0)
      multiplierMap = newMultiplierMap

      allBaseGameDetails.push({
        clusterDetails,
        payWindow,
        multiplierMap,
        payout: totalPayout,
        isNextTumble
      })

      if (isNextTumble) {
        const {
          tumbledPayWindow,
          tumbledPayWindowSymbolOccurrence
        } = this.#tumble({
          payWindow,
          clusterDetails,
          tumbleNo,
          clientSeed: `${this.#clientSeed}-base-game-tumbling-${tumbleNo}`,
          // INFO: In base game tumbling, cascading reel will always be BG2
          whichReelSet: engineSettings.glossaryTerms.BG2
        })

        payWindow = tumbledPayWindow
        symbolOccurrence = tumbledPayWindowSymbolOccurrence
        tumbleNo++
      }
    } while (isNextTumble)

    return {
      allBaseGameDetails,
      isFreeGameTriggered,
      freeSpinsAwarded,
      scatterCount
    }
  }

  #generateBGPayWindow () {
    const whichPayWindowGenerationType = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-base-game-select-paywindow-generation-type`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.baseGamePayWindowGenerationTypeTable
    })

    let returnDetails

    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-base-game-select-reel-set`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.genericSpinFromReelSetWeightTable
    })

    if (whichPayWindowGenerationType === 'WEIGHTED_CLUSTERS') {
      const _details = this.#generatePayWindowWithRandomClusterWalk({
        symbolWeightTable: engineSettings.baseGameWeightedClusterDetails.symbolWeightTable,
        clusterSizeWeightTable: engineSettings.baseGameWeightedClusterDetails.clusterSizeWeightTable,
        numberOfClustersWeightTable: engineSettings.baseGameWeightedClusterDetails.numberOfClustersWeightTable,
        whichReelSet,
        clientSeed: `${this.#clientSeed}-base-game-paywindow-generation-by-weighted-clusters`
      })

      returnDetails = { ..._details }
    } else if (whichPayWindowGenerationType === 'REEL_SETS') {
      const _details = this.#generatePayWindow({
        reelSet: this.#reelSets[whichReelSet],
        clientSeed: `${this.#clientSeed}-base-game-paywindow-generation-by-reel-sets`
      })

      returnDetails = { ..._details }
    }

    return {
      payWindow: returnDetails.payWindow,
      symbolOccurrence: returnDetails.symbolOccurrence
    }
  }

  #generatePayWindowWithRandomClusterWalk ({
    symbolWeightTable,
    clusterSizeWeightTable,
    numberOfClustersWeightTable,
    whichReelSet,
    clientSeed
  }) {
    const { payWindow } = this.#generatePayWindow({
      reelSet: this.#reelSets[whichReelSet],
      clientSeed: `${clientSeed}-reference-paywindow-generation-for-placing-random-clusters`
    })

    const numberOfClusters = +(this.getRandomGenerationUsingWeightTable({
      clientSeed: `${clientSeed}-number-of-clusters-to-choose`,
      serverSeed: this.#serverSeed,
      weightTable: numberOfClustersWeightTable
    }))

    const { chosenClusters } = this.#chooseRandomClusters({
      clientSeed: `${clientSeed}-choose-random-clusters`,
      symbolWeightTable,
      clusterSizeWeightTable,
      numberOfClusters
    })

    const {
      afterPlaceClusterPayWindow,
      afterPlaceClusterSymbolOccurrence
    } = this.#placeClustersRandomWalk({
      clientSeed: `${clientSeed}-place-clusters-random-walk`,
      chosenClusters,
      payWindow
    })

    return {
      payWindow: afterPlaceClusterPayWindow,
      symbolOccurrence: afterPlaceClusterSymbolOccurrence
    }
  }

  #chooseRandomClusters ({
    symbolWeightTable,
    clusterSizeWeightTable,
    numberOfClusters,
    clientSeed
  }) {
    const alreadyChosenSymbols = new Set()
    const chosenClusters = []
    let currentTotalClusterSize = 0
    const MAX_TOTAL_CLUSTER_SIZE = 49
    let it = 0

    let copySymbolWeightTable = { ...symbolWeightTable }

    while (chosenClusters.length < numberOfClusters && currentTotalClusterSize < MAX_TOTAL_CLUSTER_SIZE) {
      if (Object.keys(copySymbolWeightTable).length === 0) break
      const symbol = this.getRandomGenerationUsingWeightTable({
        weightTable: copySymbolWeightTable,
        clientSeed: `${clientSeed}-choose-random-clusters-symbol-generation-${it}`,
        serverSeed: this.#serverSeed
      })

      const clusterSize = this.getRandomGenerationUsingWeightTable({
        weightTable: clusterSizeWeightTable,
        clientSeed: `${clientSeed}-choose-random-clusters-${it}`,
        serverSeed: this.#serverSeed
      })

      chosenClusters.push({ symbol, clusterSize })
      alreadyChosenSymbols.add(symbol)
      currentTotalClusterSize += clusterSize

      copySymbolWeightTable = {
        ...this.#excludeKeyFromObject({
          obj: copySymbolWeightTable,
          key: symbol
        })
      }

      it++
    }

    return { chosenClusters }
  }

  #placeClustersRandomWalk ({
    chosenClusters,
    payWindow,
    clientSeed
  }) {
    const availablePositions = new Set()
    const visitedPositions = new Set()

    const _copyPayWindow = payWindow.map((reel, reelIndex) => {
      return reel.map((symbol, symbolIndex) => {
        const pos = this.#getPositionString({
          reelIndex,
          symbolIndex
        })
        if (symbol !== this.#symbolKeys.SC) {
          availablePositions.add(pos)
        }
        return symbol
      })
    })

    chosenClusters.forEach((chosenCluster, index) => {
      const { symbol, clusterSize } = chosenCluster
      const cluster = []
      const availablePositionsArr = [...availablePositions]
      const randomIndex = this.generateRandomNumber({
        clientSeed: `${clientSeed}-generate-random-number-for-chosen-clusters-${index}`,
        serverSeed: this.#serverSeed,
        maxNumber: availablePositionsArr.length
      }) - 1
      const selectedPivotPosition = availablePositionsArr[randomIndex]

      const stack = [selectedPivotPosition]

      while (stack.length !== 0 && cluster.length < clusterSize) {
        const pos = stack.pop()
        const {
          reelIndex: rI,
          symbolIndex: sI
        } = this.#getCoOrdinatesFromPositionString(pos)

        if (!(visitedPositions.has(pos))) {
          visitedPositions.add(pos)
          cluster.push(pos)
          _copyPayWindow[rI][sI] = symbol
          availablePositions.delete(pos)

          for (const neighbour of this.#neighbours) {
            const _rI = rI + neighbour[0]
            const _sI = sI + neighbour[1]
            const neighbourPos = this.#getPositionString({
              reelIndex: _rI,
              symbolIndex: _sI
            })
            if (this.#insideTheMatrix(_rI, _sI) && availablePositions.has(neighbourPos)) {
              stack.push(neighbourPos)
            }
          }
        }
      }
    })

    const afterPlaceClusterSymbolOccurrence = {}

    _copyPayWindow.forEach(reel => {
      reel.forEach(symbol => {
        afterPlaceClusterSymbolOccurrence[symbol] = (afterPlaceClusterSymbolOccurrence[symbol] ?? 0) + 1
      })
    })

    return {
      afterPlaceClusterPayWindow: _copyPayWindow,
      afterPlaceClusterSymbolOccurrence
    }
  }

  #excludeKeyFromObject ({
    obj,
    key
  }) {
    const returnObj = Object.keys(obj)
      .filter(ele => ele !== key)
      .reduce((acc, cv) => {
        acc[cv] = obj[cv]
        return acc
      }, {})
    return returnObj
  }

  #insideTheMatrix (rI, sI) {
    return (rI >= 0 && rI < this.#windowSize.width && sI >= 0 && sI < this.#windowSize.height)
  }

  #evaluateClusters ({
    payWindow,
    multiplierMap
  }) {
    const clusters = []
    const visitedPositions = new Set()
    const newMultiplierMap = {
      ...multiplierMap
    }

    for (let reelIndex = 0; reelIndex < this.#windowSize.width; reelIndex++) {
      for (let symbolIndex = 0; symbolIndex < this.#windowSize.height; symbolIndex++) {
        const currentPosition = this.#getPositionString({
          reelIndex,
          symbolIndex
        })
        const baseSymbol = payWindow[reelIndex][symbolIndex]

        if (engineSettings.valueSymbols.includes(baseSymbol)) {
          const cluster = []
          const stack = [currentPosition]

          if (!(visitedPositions.has(currentPosition))) {
            while (stack.length !== 0) {
              const pos = stack.pop()
              const {
                reelIndex: rI,
                symbolIndex: sI
              } = this.#getCoOrdinatesFromPositionString(pos)

              if (!(visitedPositions.has(pos))) {
                visitedPositions.add(pos)
                cluster.push(pos)

                for (const neighbour of this.#neighbours) {
                  const _rI = rI + neighbour[0]
                  const _sI = sI + neighbour[1]
                  if (this.#insideTheMatrix(_rI, _sI) && baseSymbol === payWindow[_rI][_sI]) {
                    const neighbourPos = this.#getPositionString({
                      reelIndex: _rI,
                      symbolIndex: _sI
                    })
                    stack.push(neighbourPos)
                  }
                }
              }
            }
          }

          if (cluster.length >= engineSettings.minimumClusterSymbolOccurrence) {
            clusters.push({
              positions: cluster,
              symbol: baseSymbol
            })
          }
        }
      }
    }

    let totalPayout = 0

    const clusterDetails = clusters.map(cluster => {
      const clusterSize = cluster.positions.length
      const symbolPayout = +(this.#symbolMultiplier[cluster.symbol][(clusterSize > 15) ? 15 : clusterSize])
      const multiplierPositions = []
      let totalMultiplierCollected = 0
      cluster.positions.forEach(position => {
        if (position in multiplierMap && multiplierMap[position] > 1) {
          totalMultiplierCollected += multiplierMap[position]
          multiplierPositions.push(position)
        }
        if (position in newMultiplierMap) {
          newMultiplierMap[position] = Math.min(newMultiplierMap[position] * 2, 128)
        } else {
          newMultiplierMap[position] = 1
        }
      })

      totalMultiplierCollected = totalMultiplierCollected === 0 ? 1 : totalMultiplierCollected

      const payout = this.getPrecision(symbolPayout * totalMultiplierCollected * this.#betAmount)

      totalPayout = this.getPrecision(totalPayout + payout)

      return {
        positions: cluster.positions,
        symbol: cluster.symbol,
        payout,
        multiplier: totalMultiplierCollected,
        multiplierPositions
      }
    })

    return {
      clusterDetails,
      totalPayout,
      newMultiplierMap
    }
  }

  #tumble ({
    payWindow,
    clusterDetails,
    clientSeed,
    whichReelSet
  }) {
    const _copyPayWindow = payWindow.map(reel => reel.map(symbol => symbol))

    const {
      payWindow: _tumblingReferencePayWindow
    } = this.#generatePayWindow({
      reelSet: this.#reelSets[whichReelSet],
      clientSeed: `${clientSeed}-paywindow-generation-after-tumbling`
    })

    clusterDetails.forEach(cluster => [
      cluster.positions.forEach(position => {
        const { reelIndex, symbolIndex } = this.#getCoOrdinatesFromPositionString(position)
        _copyPayWindow[reelIndex][symbolIndex] = engineSettings.glossaryTerms.TUMBLE
      })
    ])

    const tumbledPayWindowSymbolOccurrence = {}

    const tumbledPayWindow = _copyPayWindow.map((reel, i) => {
      const _burstReel = reel.filter(symbol => symbol !== engineSettings.glossaryTerms.TUMBLE)
      const _symbolsToBeAdded = this.#windowSize.height - _burstReel.length
      const _tumbleSymbols = _tumblingReferencePayWindow[i].slice(0, _symbolsToBeAdded)
      const _newReel = [..._tumbleSymbols, ..._burstReel]
      _newReel.forEach(symbol => {
        tumbledPayWindowSymbolOccurrence[symbol] = (tumbledPayWindowSymbolOccurrence[symbol] ?? 0) + 1
      })
      return _newReel
    })

    return {
      tumbledPayWindow,
      tumbledPayWindowSymbolOccurrence
    }
  }

  #generatePayWindow ({
    reelSet,
    clientSeed
  }) {
    const payWindow = []
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
        const symbol = reel[(randIndex + j) % reel.length]

        _.isNumber(symbolOccurrence[symbol]) ? symbolOccurrence[symbol]++ : (symbolOccurrence[symbol] = 1)
        subReel.push(symbol)
      }

      payWindow.push(subReel)
    }

    return {
      payWindow,
      symbolOccurrence
    }
  }

  #runFreeGame ({
    iteration,
    collectiveMultiplierMap,
    freeSpinSessionTotalPayout
  }) {
    let additionalFreeSpinsAwarded = 0
    const tumbleDetails = []
    let multiplierMap = {
      ...collectiveMultiplierMap
    }

    let {
      payWindow,
      symbolOccurrence
    } = this.#generateFGPayWindow({
      clientSeed: `${this.#clientSeed}-free-game-paywindow-generation-${iteration}`,
      freeSpinSessionTotalPayout
    })

    const scatterCount = symbolOccurrence[this.#symbolKeys.SC] ?? 0

    if (scatterCount >= 3) {
      additionalFreeSpinsAwarded = engineSettings.freeSpinsAwardedForScatters[scatterCount > 7 ? 7 : scatterCount]
    }

    let isNextTumble

    let tumbleNo = 0

    do {
      const { clusterDetails, totalPayout, newMultiplierMap } = this.#evaluateClusters({
        payWindow,
        multiplierMap
      })

      isNextTumble = (totalPayout > 0)
      multiplierMap = newMultiplierMap

      tumbleDetails.push({
        clusterDetails,
        payWindow,
        multiplierMap,
        payout: totalPayout,
        isNextTumble
      })

      if (isNextTumble) {
        const whichReelSetForTumble = this.getRandomGenerationUsingWeightTable({
          clientSeed: `${this.#clientSeed}-free-game-iteration-${iteration}-tumbling-${tumbleNo}-which-reel-set-for-tumble`,
          serverSeed: this.#serverSeed,
          weightTable: engineSettings.genericSpinFromReelSetWeightTable
        })

        const {
          tumbledPayWindow,
          tumbledPayWindowSymbolOccurrence
        } = this.#tumble({
          payWindow,
          clusterDetails,
          tumbleNo,
          clientSeed: `${this.#clientSeed}-free-game-iteration-${iteration}-tumbling-${tumbleNo}`,
          whichReelSet: whichReelSetForTumble
        })

        payWindow = tumbledPayWindow
        symbolOccurrence = tumbledPayWindowSymbolOccurrence
        tumbleNo++
      }
    } while (isNextTumble)

    const freeSpinPayout = tumbleDetails.reduce((acc, cv) => {
      return acc + cv.payout
    }, 0)

    return {
      tumbleDetails,
      additionalFreeSpinsAwarded,
      scatterCount,
      freeSpinPayout,
      newCollectiveMultiplierMap: multiplierMap
    }
  }

  #generateFGPayWindow ({
    clientSeed,
    freeSpinSessionTotalPayout
  }) {
    const freeSpinUpperBound = +(this.#isBuyFreeSpin ? engineSettings.freeSpinUpperBound.BUY_FREE_SPIN : engineSettings.freeSpinUpperBound.NORMAL_FREE_SPIN)
    const restrictionParameterForWeightedClusters = freeSpinSessionTotalPayout < (freeSpinUpperBound * this.#betAmount)
    const whichPayWindowGenerationType = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${clientSeed}-select-paywindow-generation-type`,
      serverSeed: this.#serverSeed,
      weightTable: this.#isBuyFreeSpin ? engineSettings.buyFreeGamePayWindowGenerationTypeTable : engineSettings.freeGamePayWindowGenerationTypeTable
    })

    let returnDetails

    if (whichPayWindowGenerationType === 'WEIGHTED_CLUSTERS' && restrictionParameterForWeightedClusters) {
      const clusterDetailsWeightTables = this.#isBuyFreeSpin ? engineSettings.buyFreeGameWeightedClusterDetails : engineSettings.freeGameWeightedClusterDetails

      const _details = this.#generatePayWindowWithRandomClusterWalk({
        symbolWeightTable: clusterDetailsWeightTables.symbolWeightTable,
        clusterSizeWeightTable: clusterDetailsWeightTables.clusterSizeWeightTable,
        numberOfClustersWeightTable: clusterDetailsWeightTables.numberOfClustersWeightTable,
        whichReelSet: engineSettings.glossaryTerms.FG1,
        clientSeed: `${clientSeed}-free-game-paywindow-generation-by-weighted-clusters`
      })

      returnDetails = { ..._details }
    } else {
      const whichReelSet = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${clientSeed}-select-paywindow-generation-reel-set`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.genericSpinFromReelSetWeightTable
      })
      const _details = this.#generatePayWindow({
        reelSet: this.#reelSets[whichReelSet],
        clientSeed: `${clientSeed}-paywindow-generation-by-reel-sets`
      })

      returnDetails = { ..._details }
    }

    return {
      payWindow: returnDetails.payWindow,
      symbolOccurrence: returnDetails.symbolOccurrence
    }
  }

  #getPositionString ({
    reelIndex,
    symbolIndex
  }) {
    return `${reelIndex},${symbolIndex}`
  }

  #getCoOrdinatesFromPositionString (str) {
    // INFO: Position string is always `${reelIndex},${symbolIndex}
    const reelIndex = +(str.split(',')[0])
    const symbolIndex = +(str.split(',')[1])

    return {
      reelIndex,
      symbolIndex
    }
  }
}

const engine6 = new Engine6Generator({
  // INFO: Here height means number of rows and width means number of reels
  windowSize: { height: engineSettings.rows, width: engineSettings.reels },
  reelSets: engineSettings.reelSets,
  symbolKeys: engineSettings.symbolKeys,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbols: engineSettings.symbols
})

export default engine6
