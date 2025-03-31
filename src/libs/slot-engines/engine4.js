import _ from 'lodash'
import SlotBase from '@src/libs/slotBase'
import engineSettings from '@src/libs/slot-engines/data/engine4Settings'

class Engine4Generator extends SlotBase {
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

      for (let i = 0; i < freeSpinsToRun; i++) {
        let globalMultiplier = 0
        const freeSpinResult = this.#runFreeGame({
          iteration: i + 1,
          clientSeed: `${this.#clientSeed}-free-game-spin-number-${i + 1}`
        })

        const isAnyMultiplierPresent = freeSpinResult.netMultiplier > 1

        if (isAnyMultiplierPresent) {
          globalMultiplier += freeSpinResult.netMultiplier
        }

        const additionalFreeSpinsAwarded = freeSpinResult.additionalFreeSpinsAwarded
        if (additionalFreeSpinsAwarded > 0) {
          freeSpinsToRun += additionalFreeSpinsAwarded
        }

        const _convertedGlobalMultiplier = (globalMultiplier === 0 ? 1 : globalMultiplier)

        allFreeSpinDetails.push({
          tumbleDetails: freeSpinResult.tumbleDetails,
          additionalFreeSpinsAwarded,
          scatterCount: freeSpinResult.scatterCount,
          isAnyMultiplierPresent,
          freeSpinPayout: this.getPrecision(freeSpinResult.currentFreeSpinPayout * (isAnyMultiplierPresent ? _convertedGlobalMultiplier : 1)),
          globalMultiplier: _convertedGlobalMultiplier
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
    isNextTumble,
    payWindow,
    winningDetails,
    multiplierMap,
    feature,
    isScatter,
    TumbleIndex
  }) {
    const extraDetails = {
      multiplier: {
        active: false,
        netMultiplier: 1,
        map: multiplierMap
      }
    }

    const formattedResult = {
      R: this.#getR(payWindow),
      winningDetails: winningDetails.map(detail => {
        return {
          ...detail,
          symbol: this.#symbolIdMap[detail.symbol]
        }
      })
    }

    if (feature.isTriggered) {
      formattedResult.feature = feature
    }

    if (TumbleIndex > 0 && !isNextTumble && (Object.keys(multiplierMap).length > 0)) {
      let netMultiplier = 0
      netMultiplier = Object.values(multiplierMap).reduce((acc1, cv1) => { return (acc1 + (+cv1)) }, 0)

      netMultiplier = (netMultiplier === 0 ? 1 : netMultiplier)

      if (feature.isTriggered && feature.details?.isDoubleMultiplier) {
        netMultiplier *= 2
      }

      extraDetails.multiplier = {
        ...extraDetails.multiplier,
        active: true,
        netMultiplier
      }
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
        symbol: this.#symbolIdMap[this.#symbolKeys.SC],
        positions
      }

      formattedResult.scatter = { ...scatter }
    }

    return {
      extraDetails,
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

    let payWindow = []
    let symbolOccurrence = {}
    let symbolPositions = {}
    let multiplierMap = {}

    if (this.#isBuyFreeSpin) {
      const payWindowSelectedIndex = (+(this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-buy-free-game-paywindow-selection-index`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.buyFreeGamePayWindowSelection.weightTable
      }))) - 1

      payWindow = engineSettings.buyFreeGamePayWindowSelection.payWindows[payWindowSelectedIndex]

      payWindow.forEach((reel, reelIndex) => {
        reel.forEach((symbol, symbolIndex) => {
          const position = this.#getPositionString({
            reelIndex,
            symbolIndex
          })
          symbolOccurrence[symbol] = (symbolOccurrence[symbol] ?? 0) + 1
          symbolPositions[symbol] = symbolPositions[symbol] ? [...symbolPositions[symbol], position] : [position]
        })
      })
    } else {
      const whichReelSet = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-base-game-select-paywindow-generation-reel-set`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.baseGameWeightTables.reelChoice
      })
      const _generatedBGPayWindow = this.#generatePayWindow({
        reelSet: this.#reelSets[whichReelSet],
        clientSeed: `${this.#clientSeed}-base-game-paywindow-generation-by-reel-sets`,
        isFreeSpin: false // INFO: This is base game
      })

      payWindow = _generatedBGPayWindow.payWindow
      symbolOccurrence = _generatedBGPayWindow.symbolOccurrence
      symbolPositions = _generatedBGPayWindow.symbolPositions
      multiplierMap = _generatedBGPayWindow.multiplierMap
    }

    const scatterCount = (symbolOccurrence[this.#symbolKeys.SC] || 0)

    if (scatterCount >= engineSettings.detailFreeSpinTriggers.BASE.scatterCountToTrigger) {
      isFreeGameTriggered = true
      freeSpinsAwarded = engineSettings.detailFreeSpinTriggers.BASE.awarded
    }

    let isNextTumble

    let tumbleNo = 0

    let featureTriggerType = null
    let featureDetails = {}

    do {
      let { totalPayout, winningDetails } = this.#evaluateWinnings({
        symbolOccurrence,
        symbolPositions
      })

      isNextTumble = (totalPayout > 0)

      // INFO: These are features of the game
      if (allBaseGameDetails.length === 0) {
        if (!isNextTumble) {
          // INFO: Check for feature three to be triggered
          const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${this.#clientSeed}-base-game-tumbling-${tumbleNo + 1}-feature-three-trigger-check`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.baseGameWeightTables.featureThree
          })
          if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
            const featureThreeDetails = this.#generateFeatureThree({
              payWindow,
              symbolOccurrence,
              clientSeed: `${this.#clientSeed}-base-game-feature-one`
            })

            if (featureThreeDetails.isFeatureRun) {
              featureTriggerType = engineSettings.featureTypeKeys.FEATURE_3
              payWindow = featureThreeDetails.afterFeaturePayWindow
              symbolOccurrence = featureThreeDetails.afterFeatureSymbolOccurrence
              symbolPositions = featureThreeDetails.afterFeatureSymbolPositions

              featureDetails = {
                beforeR: this.#getR(featureThreeDetails.beforeFeaturePayWindow),
                symbolConversionDetails: featureThreeDetails.symbolConversionDetails
              }

              const newWinnings = this.#evaluateWinnings({
                symbolOccurrence,
                symbolPositions
              })

              totalPayout = newWinnings.totalPayout
              isNextTumble = (totalPayout > 0)
              winningDetails = newWinnings.winningDetails
            }
          }
        } else if (!(symbolOccurrence[this.#symbolKeys.MU])) {
          // INFO: Check for feature one to be triggered
          const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${this.#clientSeed}-base-game-tumbling-${tumbleNo + 1}-feature-one-trigger-check`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.baseGameWeightTables.featureOne
          })
          if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
            const featureOneDetails = this.#generateFeatureOne({
              payWindow,
              symbolOccurrence,
              clientSeed: `${this.#clientSeed}-base-game-feature-one`,
              isFreeSpin: false
            })

            if (featureOneDetails.isFeatureRun) {
              featureTriggerType = engineSettings.featureTypeKeys.FEATURE_1
              payWindow = featureOneDetails.afterFeaturePayWindow
              multiplierMap = featureOneDetails.afterFeatureMultiplierMap
              symbolOccurrence = featureOneDetails.afterFeatureSymbolOccurrence
              symbolPositions = featureOneDetails.afterFeatureSymbolPositions

              featureDetails = {
                beforeR: this.#getR(featureOneDetails.beforeFeaturePayWindow),
                symbolConversionDetails: featureOneDetails.symbolConversionDetails
              }

              const newWinnings = this.#evaluateWinnings({
                symbolOccurrence,
                symbolPositions
              })

              totalPayout = newWinnings.totalPayout
              isNextTumble = (totalPayout > 0)
              winningDetails = newWinnings.winningDetails
            }
          }
        }
      }

      if (allBaseGameDetails.length !== 0 && !isNextTumble && (symbolOccurrence[this.#symbolKeys.MU] > 0) && featureTriggerType === null) {
        // INFO: Check for feature two to be triggered
        const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
          clientSeed: `${this.#clientSeed}-base-game-last-tumbling-${tumbleNo + 1}-feature-two-trigger-check`,
          serverSeed: this.#serverSeed,
          weightTable: engineSettings.baseGameWeightTables.featureTwo
        })

        if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
          featureTriggerType = engineSettings.featureTypeKeys.FEATURE_2
          featureDetails = {
            isDoubleMultiplier: true
          }
        }
      }

      let feature = {
        isTriggered: false
      }

      if (featureTriggerType !== null) {
        if (featureTriggerType === engineSettings.featureTypeKeys.FEATURE_1 || featureTriggerType === engineSettings.featureTypeKeys.FEATURE_3) {
          if (allBaseGameDetails.length === 0) {
            feature = {
              isTriggered: true,
              type: featureTriggerType,
              details: featureDetails
            }
          }
        } else if (featureTriggerType === engineSettings.featureTypeKeys.FEATURE_2) {
          feature = {
            isTriggered: true,
            type: featureTriggerType,
            details: featureDetails
          }
        }
      }

      allBaseGameDetails.push({
        payWindow,
        multiplierMap: { ...multiplierMap },
        payout: totalPayout,
        isNextTumble,
        winningDetails: [...winningDetails],
        feature
      })

      if (isNextTumble) {
        const {
          afterTumblePayWindow,
          afterTumbleSymbolOccurrence,
          afterTumbleSymbolPositions,
          afterTumbleMultiplierMap
        } = this.#tumble({
          payWindow,
          symbolOccurrence,
          multiplierMap,
          tumbleNo,
          winningDetails,
          clientSeed: `${this.#clientSeed}-base-game-tumbling-${tumbleNo}`,
          isFreeSpin: false // INFO: This is base spin game
        })

        payWindow = afterTumblePayWindow
        symbolOccurrence = afterTumbleSymbolOccurrence
        symbolPositions = afterTumbleSymbolPositions
        multiplierMap = afterTumbleMultiplierMap
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

  #generateFeatureThree ({
    payWindow,
    symbolOccurrence
  }) {
    const lowPayingSymbolsInDescendingPayout = engineSettings.lowPayingSymbolsInDescendingPayoutOrder

    let pickedLowPayingSymbolDetails = {
      symbol: null,
      count: 0
    }

    for (const symbol of lowPayingSymbolsInDescendingPayout) {
      const count = symbolOccurrence[symbol] || -1
      if (count >= pickedLowPayingSymbolDetails.count) {
        pickedLowPayingSymbolDetails = {
          symbol,
          count
        }
      }
    }

    if (pickedLowPayingSymbolDetails.symbol === null) {
      return {
        isFeatureRun: false
      }
    }

    const highPayingSymbolsInAscendingPayout = engineSettings.highPayingSymbolsInAscendingPayoutOrder

    let pickedHighPayingSymbol = null

    for (const symbol of highPayingSymbolsInAscendingPayout) {
      const count = symbolOccurrence[symbol] || 0

      const requiredCount = pickedLowPayingSymbolDetails.count + count

      if (requiredCount >= 8) {
        pickedHighPayingSymbol = symbol
        break
      }
    }

    if (pickedHighPayingSymbol === null) {
      return {
        isFeatureRun: false
      }
    }

    const afterFeatureSymbolOccurrence = {}
    const afterFeatureSymbolPositions = {}

    const afterFeaturePayWindow = payWindow.map((reel, reelIndex) => {
      return reel.map((symbol, symbolIndex) => {
        let returnedSymbol = symbol
        const position = this.#getPositionString({
          reelIndex,
          symbolIndex
        })
        if (symbol === pickedLowPayingSymbolDetails.symbol) {
          returnedSymbol = pickedHighPayingSymbol
        }
        afterFeatureSymbolPositions[returnedSymbol] = (afterFeatureSymbolPositions[returnedSymbol] ? [...afterFeatureSymbolPositions[returnedSymbol], position] : [position])
        afterFeatureSymbolOccurrence[returnedSymbol] = afterFeatureSymbolOccurrence[returnedSymbol] ? (afterFeatureSymbolOccurrence[returnedSymbol] + 1) : 1

        return returnedSymbol
      })
    })

    return {
      isFeatureRun: true,
      afterFeaturePayWindow,
      afterFeatureSymbolOccurrence,
      afterFeatureSymbolPositions,
      beforeFeaturePayWindow: payWindow,
      symbolConversionDetails: {
        previousSymbol: this.#symbolIdMap[pickedLowPayingSymbolDetails.symbol],
        newSymbol: this.#symbolIdMap[pickedHighPayingSymbol]
      }
    }
  }

  #generateFeatureOne ({
    payWindow,
    symbolOccurrence,
    clientSeed,
    isFreeSpin
  }) {
    const symbolsToCheck = engineSettings.valueSymbols

    const nonWinSymbols = []

    for (const symbol of symbolsToCheck) {
      if (symbolOccurrence[symbol] < 8) {
        nonWinSymbols.push(symbol)
      }
    }

    if (nonWinSymbols.length === 0) {
      return {
        isFeatureRun: false
      }
    }

    const pickedNonWinSymbolIndex = this.generateRandomNumber({
      clientSeed: `${clientSeed}-feature-one-pick-random-symbol-for-conversion`,
      serverSeed: this.#serverSeed,
      maxNumber: nonWinSymbols.length
    }) - 1

    const pickedNonWinSymbol = nonWinSymbols[pickedNonWinSymbolIndex]

    const afterFeatureSymbolOccurrence = {}
    const afterFeatureSymbolPositions = {}
    const afterFeatureMultiplierMap = {}

    let picked = false

    let symbolConversionDetails = {
      position: '',
      newMultiplier: 1
    }

    const afterFeaturePayWindow = payWindow.map((reel, reelIndex) => {
      return reel.map((symbol, symbolIndex) => {
        let returnedSymbol = symbol
        const position = this.#getPositionString({
          reelIndex,
          symbolIndex
        })
        if (symbol === pickedNonWinSymbol && !picked) {
          returnedSymbol = this.#symbolKeys.MU
          picked = true
          const newMultiplier = +(this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-feature-one-multiplier-generation-${position}`,
            serverSeed: this.#serverSeed,
            weightTable: isFreeSpin ? engineSettings.multiplierValueWeightTables.FG : engineSettings.multiplierValueWeightTables.BG
          }))

          symbolConversionDetails = {
            position,
            newMultiplier
          }

          afterFeatureMultiplierMap[position] = symbolConversionDetails.newMultiplier
        }
        afterFeatureSymbolPositions[returnedSymbol] = (afterFeatureSymbolPositions[returnedSymbol] ? [...afterFeatureSymbolPositions[returnedSymbol], position] : [position])
        afterFeatureSymbolOccurrence[returnedSymbol] = afterFeatureSymbolOccurrence[returnedSymbol] ? (afterFeatureSymbolOccurrence[returnedSymbol] + 1) : 1

        return returnedSymbol
      })
    })

    return {
      isFeatureRun: true,
      afterFeaturePayWindow,
      afterFeatureSymbolOccurrence,
      afterFeatureSymbolPositions,
      afterFeatureMultiplierMap,
      beforeFeaturePayWindow: payWindow,
      symbolConversionDetails
    }
  }

  #evaluateWinnings ({
    symbolOccurrence,
    symbolPositions
  }) {
    const symbolsToCheck = engineSettings.valueSymbols

    const winningDetails = []

    let totalPayout = 0

    for (const symbol of symbolsToCheck) {
      const count = +(symbolOccurrence[symbol])
      if (count >= 8) {
        const payout = this.getPrecision((+(this.#symbolMultiplier[symbol][count > 12 ? 12 : count])) * this.#betAmount)
        totalPayout = this.getPrecision(totalPayout + payout)
        winningDetails.push({
          payout,
          symbol,
          positions: symbolPositions[symbol],
          count
        })
      }
    }

    return {
      totalPayout,
      winningDetails
    }
  }

  #tumble ({
    payWindow,
    multiplierMap,
    winningDetails,
    tumbleNo,
    clientSeed,
    isFreeSpin
  }) {
    const afterTumbleMultiplierMap = { ...multiplierMap }
    const _copyPayWindow = payWindow.map(reel => reel.map(symbol => symbol))

    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${clientSeed}-select-paywindow-generation-reel-set-for-tumble-${tumbleNo + 1}`,
      serverSeed: this.#serverSeed,
      weightTable: isFreeSpin ? engineSettings.freeGameWeightTables.reelChoice : engineSettings.baseGameWeightTables.reelChoice
    })

    const {
      payWindow: _tumblingReferencePayWindow
    } = this.#generatePayWindow({
      reelSet: this.#reelSets[whichReelSet],
      clientSeed: `${clientSeed}-paywindow-generation-after-tumbling-${tumbleNo + 1}`,
      isFreeSpin
    })

    winningDetails.forEach(winning => [
      winning.positions.forEach(position => {
        const {
          reelIndex,
          symbolIndex
        } = this.#getCoOrdinatesFromPositionString(position)
        _copyPayWindow[reelIndex][symbolIndex] = engineSettings.usefulKeys.TUMBLE
      })
    ])

    const afterTumbleSymbolOccurrence = {}
    const afterTumbleSymbolPositions = {}

    const afterTumblePayWindow = _copyPayWindow.map((reel, i) => {
      const _burstReel = reel.filter(symbol => symbol !== engineSettings.usefulKeys.TUMBLE)
      const _symbolsToBeAdded = this.#windowSize.height - _burstReel.length
      const _tumbleSymbols = _tumblingReferencePayWindow[i].slice(0, _symbolsToBeAdded)
      const _newReel = [..._tumbleSymbols, ..._burstReel]
      _newReel.forEach((symbol, j) => {
        afterTumbleSymbolOccurrence[symbol] = (afterTumbleSymbolOccurrence[symbol] ?? 0) + 1
        const position = this.#getPositionString({
          reelIndex: i,
          symbolIndex: j
        })
        afterTumbleSymbolPositions[symbol] = afterTumbleSymbolPositions[symbol] ? [...afterTumbleSymbolPositions[symbol], position] : [position]
        if (symbol === this.#symbolKeys.MU && (!afterTumbleMultiplierMap[position])) {
          afterTumbleMultiplierMap[position] = +(this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-multiplier-generation-${position}`,
            serverSeed: this.#serverSeed,
            weightTable: isFreeSpin ? engineSettings.multiplierValueWeightTables.FG : engineSettings.multiplierValueWeightTables.BG
          }))
        }
      })
      return _newReel
    })

    return {
      afterTumblePayWindow,
      afterTumbleSymbolOccurrence,
      afterTumbleSymbolPositions,
      afterTumbleMultiplierMap
    }
  }

  #generatePayWindow ({
    reelSet,
    clientSeed,
    isFreeSpin
  }) {
    const payWindow = []
    const symbolOccurrence = {}
    const symbolPositions = {}
    const multiplierMap = {}

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
        const position = this.#getPositionString({
          reelIndex: i,
          symbolIndex: j
        })
        symbolPositions[symbol] = (symbolPositions[symbol] ? [...symbolPositions[symbol], position] : [position])
        subReel.push(symbol)

        if (symbol === this.#symbolKeys.MU) {
          multiplierMap[position] = +(this.getRandomGenerationUsingWeightTable({
            clientSeed: `${this.#clientSeed}-multiplier-generation-${i}-${j}`,
            serverSeed: this.#serverSeed,
            weightTable: isFreeSpin ? engineSettings.multiplierValueWeightTables.FG : engineSettings.multiplierValueWeightTables.BG
          }))
        }
      }

      payWindow.push(subReel)
    }

    return {
      payWindow,
      symbolOccurrence,
      symbolPositions,
      multiplierMap
    }
  }

  #runFreeGame ({
    iteration,
    clientSeed
  }) {
    let additionalFreeSpinsAwarded = 0
    const tumbleDetails = []

    const whichReelSet = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${clientSeed}-select-paywindow-generation-reel-set-in-spin`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.freeGameWeightTables.reelChoice
    })

    let {
      payWindow,
      symbolOccurrence,
      symbolPositions,
      multiplierMap
    } = this.#generatePayWindow({
      reelSet: this.#reelSets[whichReelSet],
      clientSeed: `${clientSeed}-paywindow-generation-by-reel-sets-in-spin`,
      isFreeSpin: true // INFO: This is free spin
    })

    const scatterCount = symbolOccurrence[this.#symbolKeys.SC] ?? 0

    if (scatterCount >= engineSettings.detailFreeSpinTriggers.RETRIGGER.scatterCountToTrigger) {
      additionalFreeSpinsAwarded = engineSettings.detailFreeSpinTriggers.RETRIGGER.awarded
    }

    let isNextTumble

    let tumbleNo = 0

    let featureTriggerType = null
    let featureDetails = {}

    do {
      let { totalPayout, winningDetails } = this.#evaluateWinnings({
        symbolOccurrence,
        symbolPositions
      })

      isNextTumble = (totalPayout > 0)

      // INFO: These are features of the game
      if (tumbleDetails.length === 0) {
        if (!isNextTumble) {
          // INFO: Check for feature three to be triggered
          const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-free-game-tumbling-${tumbleNo + 1}-feature-three-trigger-check`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.freeGameWeightTables.featureThree
          })
          if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
            const featureThreeDetails = this.#generateFeatureThree({
              payWindow,
              symbolOccurrence,
              clientSeed: `${clientSeed}-free-game-feature-one`
            })

            if (featureThreeDetails.isFeatureRun) {
              featureTriggerType = engineSettings.featureTypeKeys.FEATURE_3
              payWindow = featureThreeDetails.afterFeaturePayWindow
              symbolOccurrence = featureThreeDetails.afterFeatureSymbolOccurrence
              symbolPositions = featureThreeDetails.afterFeatureSymbolPositions

              featureDetails = {
                beforeR: this.#getR(featureThreeDetails.beforeFeaturePayWindow),
                symbolConversionDetails: featureThreeDetails.symbolConversionDetails
              }

              const newWinnings = this.#evaluateWinnings({
                symbolOccurrence,
                symbolPositions
              })

              totalPayout = newWinnings.totalPayout
              isNextTumble = (totalPayout > 0)
              winningDetails = newWinnings.winningDetails
            }
          }
        } else if (!(symbolOccurrence[this.#symbolKeys.MU])) {
          // INFO: Check for feature one to be triggered
          const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
            clientSeed: `${clientSeed}-free-game-tumbling-${tumbleNo + 1}-feature-one-trigger-check`,
            serverSeed: this.#serverSeed,
            weightTable: engineSettings.freeGameWeightTables.featureOne
          })
          if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
            const featureOneDetails = this.#generateFeatureOne({
              payWindow,
              symbolOccurrence,
              clientSeed: `${clientSeed}-free-game-feature-one`,
              isFreeSpin: true
            })

            if (featureOneDetails.isFeatureRun) {
              featureTriggerType = engineSettings.featureTypeKeys.FEATURE_1
              payWindow = featureOneDetails.afterFeaturePayWindow
              multiplierMap = featureOneDetails.afterFeatureMultiplierMap
              symbolOccurrence = featureOneDetails.afterFeatureSymbolOccurrence
              symbolPositions = featureOneDetails.afterFeatureSymbolPositions

              featureDetails = {
                beforeR: this.#getR(featureOneDetails.beforeFeaturePayWindow),
                symbolConversionDetails: featureOneDetails.symbolConversionDetails
              }

              const newWinnings = this.#evaluateWinnings({
                symbolOccurrence,
                symbolPositions
              })

              totalPayout = newWinnings.totalPayout
              isNextTumble = (totalPayout > 0)
              winningDetails = newWinnings.winningDetails
            }
          }
        }
      }

      if (tumbleDetails.length !== 0 && !isNextTumble && (symbolOccurrence[this.#symbolKeys.MU] > 0) && featureTriggerType === null) {
        // INFO: Check for feature two to be triggered
        const isFeatureTrigger = this.getRandomGenerationUsingWeightTable({
          clientSeed: `${clientSeed}-free-game-last-tumbling-${tumbleNo + 1}-feature-two-trigger-check`,
          serverSeed: this.#serverSeed,
          weightTable: engineSettings.freeGameWeightTables.featureTwo
        })

        if (isFeatureTrigger === engineSettings.usefulKeys.TRIGGER) {
          featureTriggerType = engineSettings.featureTypeKeys.FEATURE_2
          featureDetails = {
            isDoubleMultiplier: true
          }
        }
      }

      let feature = {
        isTriggered: false
      }

      if (featureTriggerType !== null) {
        if (featureTriggerType === engineSettings.featureTypeKeys.FEATURE_1 || featureTriggerType === engineSettings.featureTypeKeys.FEATURE_3) {
          if (tumbleDetails.length === 0) {
            feature = {
              isTriggered: true,
              type: featureTriggerType,
              details: featureDetails
            }
          }
        } else if (featureTriggerType === engineSettings.featureTypeKeys.FEATURE_2) {
          feature = {
            isTriggered: true,
            type: featureTriggerType,
            details: featureDetails
          }
        }
      }

      tumbleDetails.push({
        payWindow,
        multiplierMap,
        payout: totalPayout,
        isNextTumble,
        winningDetails,
        feature
      })

      if (isNextTumble) {
        const {
          afterTumblePayWindow,
          afterTumbleSymbolOccurrence,
          afterTumbleSymbolPositions,
          afterTumbleMultiplierMap
        } = this.#tumble({
          payWindow,
          symbolOccurrence,
          multiplierMap,
          tumbleNo,
          winningDetails,
          clientSeed: `${clientSeed}-free-spin-tumbling-${tumbleNo}`,
          isFreeSpin: true // INFO: This is free spin game
        })

        payWindow = afterTumblePayWindow
        symbolOccurrence = afterTumbleSymbolOccurrence
        symbolPositions = afterTumbleSymbolPositions
        multiplierMap = afterTumbleMultiplierMap
        tumbleNo++
      }
    } while (isNextTumble)

    const currentFreeSpinPayout = tumbleDetails.reduce((acc, cv) => {
      return acc + cv.payout
    }, 0)

    let netMultiplier = 0

    const lastTumbleDetails = tumbleDetails[tumbleDetails.length - 1]

    if (currentFreeSpinPayout > 0 && (Object.keys(lastTumbleDetails.multiplierMap).length > 0)) {
      netMultiplier = Object.values(lastTumbleDetails.multiplierMap).reduce((acc1, cv1) => { return (acc1 + (+cv1)) }, 0)

      netMultiplier = (netMultiplier === 0 ? 1 : netMultiplier)

      if (lastTumbleDetails.feature.isTriggered && lastTumbleDetails.feature.details?.isDoubleMultiplier) {
        netMultiplier *= 2
      }
    }

    netMultiplier = (netMultiplier === 0 ? 1 : netMultiplier)

    return {
      tumbleDetails,
      additionalFreeSpinsAwarded,
      scatterCount,
      currentFreeSpinPayout,
      netMultiplier
    }
  }

  #getPositionString ({
    reelIndex,
    symbolIndex
  }) {
    // INFO: Position string is always `${reelIndex},${symbolIndex}
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

const engine4 = new Engine4Generator({
  // INFO: Here height means number of rows and width means number of reels
  windowSize: { height: engineSettings.rows, width: engineSettings.reels },
  reelSets: engineSettings.reelSets,
  symbolKeys: engineSettings.symbolKeys,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbols: engineSettings.symbols
})

export default engine4
