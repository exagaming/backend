import SlotBase from '@src/libs/slotBase'
import engineSettings from '@src/libs/slot-engines/data/engine9Settings'

class Engine9SlotGenerator extends SlotBase {
  #clientSeed = ''
  #serverSeed = ''
  #bgoly=[]
  #fgoly=[]
  #symbolMultiplier = {}
  #patterns = []
  #windowSize = { width: 0, height: 0 }
  #symbolIdMap = {}
  #minimumSymbolOccurrence = 2
  #betAmount=0
  #bgha = []
  #fgha = []
  #volatilityMode = ''
  #glossary = {}
  #expandedRows = []
  constructor ({ patterns, payDirection, windowSize, multiplierWeights, symbolMultiplier, symbolIdMap, reelSets, glossary }) {
    super()
    this.#bgoly = reelSets.bgoly
    this.#fgoly = reelSets.fgoly
    this.#bgha = reelSets.bgha
    this.#fgha = reelSets.fgha
    this.#patterns = patterns
    this.payDirection = payDirection
    this.#symbolMultiplier = symbolMultiplier
    this.#windowSize = windowSize
    this.multiplierWeights = multiplierWeights
    this.#symbolIdMap = symbolIdMap
    this.#glossary = glossary
  }

  init ({ clientSeed, serverSeed, betAmount, volatilityMode }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
    this.#volatilityMode = volatilityMode
  }

  transpose ({ matrix }) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]))
  }

  expandColumns (expandedColumns, payWindow) {
    for (const column of expandedColumns) {
      for (let i = 0; i < payWindow.length; i++) {
        if (i % 5 === column) {
          payWindow[i] = this.#glossary.EXPAND
        }
      }
    }
    return payWindow
  }

  freeSpins ({ reelType }) {
    // Select the appropriate reel set based on reelType
    const reelSet = reelType === this.#glossary.HADES ? this.#fgha : this.#fgoly
    const freeSpinsGameResult = []
    const expandedCols = []
    let multiplier = 1
    // Loop through the awarded free spins
    for (let i = 0; i < engineSettings.freeSpinsAwarded; i++) {
      if (i !== 0) {
        freeSpinsGameResult[i - 1].payWindow.forEach((value, index) => {
          const column = index % 5
          if (value === this.#glossary.EXPAND) {
            expandedCols.push(column)
          }
        })
        //  check if expand is there in any row
      }
      // Generate paywindow and calculate payout
      let { payWindow, symbolOccurrence, expandedPaywindow } = this.#generatePayWindow({
        reelSet,
        clientSeed: `${this.#clientSeed}-free-spin-paywindow-generation-iteration-${i + 1}`
      })

      const multiplierMap = {}
      // Calculate multiplier based on the occurrence of 'WD1' wild symbol
      for (let i = 0; i < payWindow.length; i++) {
        if (payWindow[i] === this.#glossary.WD1) {
          const multi = this.#generateMultiplier()
          multiplierMap[i] = multi
          multiplier === 1 ? multiplier = multi : multiplier += multi
          expandedCols.push(i)
        }
      }
      //  expand columns with EXPAND keyword
      if (expandedCols.length) {
        payWindow = this.expandColumns(expandedCols, payWindow)
      }

      // Check the patterns and calculate the result
      const result = this.#checkPatterns({ payWindow, symbolOccurrence })

      // Push the result of each free spin into the freeSpinsGameResult array
      freeSpinsGameResult.push({
        payWindow,
        result,
        expandedPaywindow,
        multiplier: multiplier === 0 ? 1 : multiplier,
        multiplierMap
      })
    }

    // Return the results of all free spins after the loop has completed
    return {
      freeSpinsGameResult,
      freeSpinsAwarded: engineSettings.freeSpinsAwarded
    }
  }

  generate () {
    const spinType = this.#glossary.BASE_SPIN
    const reelType = this.#volatilityMode === engineSettings.volatilityModes.OLYMPUS ? this.#glossary.OLYMPUS : this.#glossary.HADES
    const reelSet = reelType === this.#glossary.HADES ? this.#bgha : this.#bgoly

    const isFreeGameTriggered = false

    const { payWindow, symbolOccurrence, expandedPaywindow } = this.#generatePayWindow({
      reelSet,
      clientSeed: `${this.#clientSeed}-base-game-paywindow-generation`
    })
    // delete symbolOccurrence.FG
    let multiplierCount = 0
    for (const ele of payWindow) {
      if (ele === this.#glossary.WD1) {
        multiplierCount++
      }
    }
    let multiplier = 0
    const multiplierMap = {}
    if (multiplierCount && spinType === this.#glossary.BASE_SPIN) {
      for (let i = 0; i < multiplierCount; i++) {
        const multi = this.#generateMultiplier()
        multiplierMap[i] = multi
        multiplier += multi
      }
    }

    multiplier = (multiplier === 0 ? 1 : multiplier)

    // delete symbolOccurrence.expand
    const result = this.#checkPatterns({ payWindow: expandedPaywindow, symbolOccurrence })

    // calculate for free spins
    let fgcount = 0
    for (const ele of payWindow) {
      if (ele === this.#glossary.FG) {
        fgcount++
      }
    }

    let freeGameDetails = {
      isFreeGameTriggered,
      freeSpinsGameResult: [],
      freeSpinsAwarded: 0
    }

    if (fgcount >= 2) {
      // Trigger free spins
      const { freeSpinsGameResult, freeSpinsAwarded } = this.freeSpins({ reelType })
      freeGameDetails = {
        isFreeGameTriggered: true,
        freeSpinsGameResult,
        freeSpinsAwarded
      }
    }

    return {
      baseGameDetails: {
        result,
        payWindow,
        multiplier,
        multiplierMap
      },
      freeGameDetails
    }
  }

  #generateMultiplier () {
    return this.getRandomGenerationUsingWeightTable({
      serverSeed: this.#serverSeed,
      clientSeed: `${this.#clientSeed}-generate-multiplier`,
      weightTable: engineSettings.multiplierWeights
    })
  }

  #checkPatterns ({ payWindow, symbolOccurrence }) {
    const result = []
    Object.keys(this.#patterns).forEach((patternNumber) => {
      for (const symbol in symbolOccurrence) {
        const matchedData = this.#patternMatched({ symbol, payWindow, patternNumber })
        if (matchedData.matched) {
          result.push(matchedData)
        }
      }
    })
    return result
  }

  #patternMatched ({ symbol, payWindow, patternNumber }) {
    const pattern = this.#patterns[patternNumber]
    const matchedPatternIndexes = []
    for (const index in pattern) {
      const currentSymbol = payWindow[pattern[index]]
      if (currentSymbol === this.#glossary.FG) break
      if (currentSymbol !== symbol && currentSymbol !== this.#glossary.WD) break
      matchedPatternIndexes.push(Math.floor(pattern[index] / engineSettings.column))
    }
    return {
      symbol,
      patternNumber,
      matchedPatternIndexes,
      pattern: this.#patterns[patternNumber],
      matched: matchedPatternIndexes.length >= this.#minimumSymbolOccurrence
    }
  }

  #generatePayWindow ({
    reelSet,
    clientSeed
  }) {
    let payWindow = []
    let symbolOccurrence = {}
    let expandedPaywindow = []
    // Build the initial pay window matrix
    for (let i = 0; i < this.#windowSize.width; i++) {
      const reel = reelSet[i]
      const randIndex = this.generateRandomNumber({
        clientSeed: `${clientSeed}-reel-${i + 1}`,
        serverSeed: this.#serverSeed,
        maxNumber: reel.length
      })

      const subReel = []
      for (let j = 0; j < this.#windowSize.height; j++) {
        const symbol = reel[(randIndex + j) % reel.length]
        subReel.push(symbol)
      }
      payWindow.push(subReel)
    }

    //  commented this so , expand window can be done in freespin service.js
    // if (spinType === this.#glossary.FREE_SPIN && this.#expandedRows.length) {
    //   for (const row of this.#expandedRows) {
    //     for (let i = 0; i < payWindow.length; i++) {
    //       payWindow[i][row] = this.#glossary.EXPAND
    //     }
    //   }
    // }
    expandedPaywindow = [...payWindow]

    //  commenting the code so that we can expand the window in freespinservice.js
    // If spinType is 'free', check each column for WD1
    // if (spinType === this.#glossary.FREE_SPIN) {
    //   for (let i = 0; i < expandedPaywindow[0].length; i++) {
    //     const columnHasWD1 = expandedPaywindow.some(row => row[i] === this.#glossary.WD1)
    //     if (columnHasWD1) {
    //       for (let j = 0; j < expandedPaywindow.length; j++) {
    //         expandedPaywindow[j][i] = this.#glossary.EXPAND
    //       }
    //       this.#expandedRows.push(i)
    //     }
    //   }
    // }

    for (const ele of payWindow) {
      for (const ele2 of ele) {
        if (symbolOccurrence[ele2]) {
          symbolOccurrence[ele2]++
        } else {
          symbolOccurrence[ele2] = 1
        }
      }
    }

    // Filter out symbols that don't meet the minimum occurrence requirement
    symbolOccurrence = Object.entries(symbolOccurrence)
      .filter(([key, value]) => value >= this.#minimumSymbolOccurrence && ((key !== this.#glossary.FG) || (key !== this.#glossary.EXPAND) || (key !== this.#glossary.WD1)))
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})
    payWindow = payWindow.flat()
    expandedPaywindow = expandedPaywindow.flat()

    return { payWindow, symbolOccurrence, expandedPaywindow }
  }

  formatFreeSpinResult ({ currentFreeSpinDetail }) {
    let totalPayout = 0

    const formattedResult = {
      R: this.#getR({ payWindow: currentFreeSpinDetail.payWindow }),
      expandedR: this.#getR({ payWindow: currentFreeSpinDetail.expandedPaywindow })
    }

    const winDetails = {
      details: [],
      AWP: Array.from({ length: this.#windowSize.width }, () => new Set())
    }

    currentFreeSpinDetail.result.forEach(winResult => {
      const totalSymbolMatched = winResult.matchedPatternIndexes.length
      const payout = this.getPrecision(this.#betAmount * (this.#symbolMultiplier[winResult.symbol][totalSymbolMatched]))

      totalPayout = this.getPrecision(payout + totalPayout)

      if (payout > 0) {
        winResult.matchedPatternIndexes.forEach((value, index) => winDetails.AWP[index].add(value))

        winDetails.details.push({
          matched: totalSymbolMatched,
          payout,
          multiplier: +currentFreeSpinDetail.multiplier,
          pattern: this.#patterns[winResult.patternNumber],
          symbol: this.#symbolIdMap[winResult.symbol]
        })
      }
    })

    winDetails.AWP = winDetails.AWP.map(data => [...data])

    totalPayout = this.getPrecision(totalPayout * (+currentFreeSpinDetail.multiplier))

    if (totalPayout > 0) {
      formattedResult.winDetails = { ...winDetails }
    }

    return {
      formattedResult,
      totalPayout
    }
  }

  formatResult ({ result, multiplier, payWindow }) {
    let totalPayout = 0

    const winDetails = {
      details: [],
      AWP: Array.from({ length: this.#windowSize.width }, () => new Set())
    }

    const formattedResult = {
      R: this.#getR({ payWindow })
    }

    if (!result.length) return { formattedResult, totalPayout }

    result.forEach(winResult => {
      const totalSymbolMatched = winResult.matchedPatternIndexes.length
      const payout = this.getPrecision(this.#betAmount * (this.#symbolMultiplier[winResult.symbol][totalSymbolMatched]))

      totalPayout = this.getPrecision(payout + totalPayout)

      if (payout > 0) {
        winResult.matchedPatternIndexes.forEach((value, index) => winDetails.AWP[index].add(value))

        winDetails.details.push({
          matched: totalSymbolMatched,
          payout,
          multiplier,
          pattern: this.#patterns[winResult.patternNumber],
          symbol: this.#symbolIdMap[winResult.symbol]
        })
      }
    })

    winDetails.AWP = winDetails.AWP.map(data => [...data])

    totalPayout = this.getPrecision(totalPayout * multiplier)

    if (totalPayout > 0) {
      formattedResult.winDetails = { ...winDetails }
    }

    return { totalPayout: this.getPrecision(totalPayout), formattedResult }
  }

  #getR ({ payWindow }) {
    let R = payWindow.flat().reduce((prev, symbol, index) => {
      prev +=
            this.#symbolIdMap[symbol] +
            ((index % this.#windowSize.height) >> 0 === this.#windowSize.height - 1 ? '|' : ',')
      return prev
    }, '')
    R = R.substring(0, R.length - 1)
    return R
  }
}

const engine9 = new Engine9SlotGenerator({
  patterns: engineSettings.patterns,
  payDirection: engineSettings.payDirection,
  windowSize: { width: engineSettings.column, height: engineSettings.row },
  multiplierWeights: engineSettings.multiplierWeights,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbolIdMap: engineSettings.symbolIdMap,
  reelSets: engineSettings.reelSets,
  glossary: engineSettings.glossary
})

export default engine9
