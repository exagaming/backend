import _ from 'lodash'
import SlotBase from '@src/libs/slotBase'
import { plus, times } from 'number-precision'
import engineSettings from '@src/libs/slot-engines/data/engine12Settings'

class PayLineSlotGenerator extends SlotBase {
  /** @type {Reel} */
  #reels = {}

  /** @type {Symbol[]} */
  #symbols = []

  /** @type {SymbolMultiplier} */
  #symbolMultiplier = {}

  /** @type {Patterns} */
  #patterns = []

  /** @type {WindowSize} */
  #windowSize = { width: 0, height: 0 }

  /** @type {SymbolIdMap} */
  #symbolIdMap = {}

  /** @type {number} */
  #minimumSymbolOccurrence = 3

  /** @type {string} */
  #clientSeed = ''

  /** @type {string} */
  #serverSeed = ''

  /** @type {number} */
  #betAmount = 0

  /** @type {number} */
  #RTP = 96

  /**
   * @param {WindowSize} windowSize
   * @param {Reel[]} reels
   * @param {Patterns} patterns
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reels, patterns, symbolIdMap, symbolMultiplier, symbols }) {
    super()
    this.#reels = reels
    this.#patterns = patterns
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

  init ({ clientSeed, serverSeed, betAmount, rtp }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
    if (rtp && engineSettings.rptList.includes(rtp)) this.#RTP = rtp
  }

  generate ({ isBuyFreeSpin }) {
    const reelNumber = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-select-reel`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.baseGameReelWeights
    })

    let freeGameTriggered
    if (!isBuyFreeSpin) {
      freeGameTriggered = +this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-free-game`,
        serverSeed: this.#serverSeed,
        weightTable: engineSettings.freeGameTriggerProbability[this.#RTP]
      })
    } else {
      freeGameTriggered = isBuyFreeSpin
      this.isBuyFreeSpin = true
    }

    const { payWindow, symbolOccurrence } = this.#generatePayWindow({ reelSet: this.#reels[reelNumber], freeGameTriggered })

    let result
    if (freeGameTriggered) {
      result = this.#runFreeGame(freeGameTriggered)
    } else {
      result = this.#checkPatterns({ symbolOccurrence, payWindow })
    }
    return { result, payWindow, freeGameTriggered }
  }

  #addScatterInPayWindow (payWindow, scatterCount) {
    const rowIndices = new Set()
    let count = 0
    while (rowIndices.size < scatterCount) {
      rowIndices.add(
        Math.floor(
          this.generateRandomDecimal({
            clientSeed: `${this.#clientSeed}-select-random-row-${rowIndices.size}-${count}`,
            serverSeed: this.#serverSeed,
            maxNumber: 1
          }) * payWindow.length
        )
      )
      count++
    }

    rowIndices.forEach(index => {
      const row = payWindow[index]
      const randomPosition = Math.floor(this.generateRandomDecimal({ clientSeed: `${this.#clientSeed}-select-random-index-${index}`, serverSeed: this.#serverSeed, maxNumber: 1 }) * row.length)
      row[randomPosition] = engineSettings.specialSymbol.SCATTER
    })
  }

  #generatePayWindow ({ reelSet, freeGameTriggered }) {
    let payWindow = []
    const symbolOccurrence = {}

    for (let i = 0; i < this.#windowSize.width; i++) {
      const reel = reelSet[i]

      const randIndex = this.generateRandomNumber({
        clientSeed: `${this.#clientSeed}-reel-number-${i}`,
        serverSeed: this.#serverSeed,
        maxNumber: reel.length
      }) - 1

      const subReel = []
      for (let j = 0; j < this.#windowSize.height; j++) {
        const symbol = reel[(randIndex + j) % reel.length]
        _.isNumber(symbolOccurrence[symbol]) ? symbolOccurrence[symbol]++ : symbolOccurrence[symbol] = 1
        subReel.push(symbol)
      }

      payWindow.push(subReel)
    }

    if (freeGameTriggered) {
      this.#addScatterInPayWindow(payWindow, freeGameTriggered)
    }

    this.payWindowMatrix = payWindow

    payWindow = this.transpose(payWindow).flat()

    return { payWindow, symbolOccurrence }
  }

  #checkPatterns ({ symbolOccurrence, payWindow }) {
    const result = []

    Object.keys(this.#patterns).forEach(patternNumber => {
      for (const symbol in symbolOccurrence) {
        // Left to Right match
        let matchedData = this.#patternMatched({ symbol, payWindow, patternNumber, payDirection: engineSettings.payDirection.leftToRight })
        if (matchedData.matched) result.push(matchedData)
        // Right to Left match
        matchedData = this.#patternMatched({ symbol, payWindow, patternNumber, payDirection: engineSettings.payDirection.rightToLeft })
        if (matchedData.matched) result.push(matchedData)
      }
    })

    return result
  }

  #patternMatched ({ symbol, payWindow, patternNumber, payDirection }) {
    const pattern = payDirection === engineSettings.payDirection.leftToRight ? this.#patterns[patternNumber] : [...this.#patterns[patternNumber]].reverse()
    const matchedPatternIndexes = []

    for (const index in pattern) {
      if (payWindow[pattern[index]] === symbol || payWindow[pattern[index]] === engineSettings.specialSymbol.WILD) {
        matchedPatternIndexes.push(Math.floor(pattern[index] / engineSettings.column))
      } else {
        break
      }
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

  #runFreeGame (spinType) {
    let spinCount = 0
    let totalWin = 0

    let exitProbStart = this.isBuyFreeSpin ? engineSettings.buyFreeSpin[spinType].exitRTP[this.#RTP].freeGameStartExitProbability : engineSettings.freeGameStartExitProbability[spinType]
    const exitProbStopSpinCount = this.isBuyFreeSpin ? engineSettings.buyFreeSpin[spinType].exitRTP.freeGameNumberOfSpinsToChangeExitProbability : engineSettings.freeGameNumberOfSpinsToChangeExitProbability[spinType]
    let globalMultiplier = engineSettings.freeGameDefaultGlobalMultiplier

    const freeGameWinningSymbolWeights = this.isBuyFreeSpin ? engineSettings.buyFreeSpin[spinType].freeGameWinningSymbolWeights : engineSettings.freeGameWinningSymbolWeights
    const freeGameMiniReelWeights = this.isBuyFreeSpin ? engineSettings.buyFreeSpin[spinType].freeGameMiniReelWeights : engineSettings.freeGameMiniReelWeights
    const freeGamePayouts = engineSettings.freeGamePayouts
    const exitProbStop = this.isBuyFreeSpin ? engineSettings.buyFreeSpin[spinType].exitRTP.freeGameStopExitProbability : engineSettings.freeGameStopExitProbability[spinType]

    const result = []

    while (true) {
      const spinDetails = {}
      result.push(spinDetails)
      spinDetails.spinNumber = spinCount + 1
      spinDetails.scatterCount = spinType

      const decimalNumber = this.generateRandomDecimal({
        clientSeed: `${this.#clientSeed}-random-free-spin-${result.length}`,
        serverSeed: this.#serverSeed,
        maxNumber: 1
      })

      // Check if we should exit
      if (decimalNumber < exitProbStart) {
        spinDetails.exit = true
        spinDetails.selectedSymbol = engineSettings.specialSymbol.EXIT
        spinDetails.totalWin = totalWin
        spinDetails.winAmount = 0
        spinDetails.payout = 0
        spinDetails.globalMultiplier = globalMultiplier
        return result
      }

      spinDetails.exit = false

      // Pick a random symbol from the mini game
      const miniGameSymbol = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-win-symbol-${result.length}`,
        serverSeed: this.#serverSeed,
        weightTable: freeGameWinningSymbolWeights
      })

      spinDetails.selectedSymbol = miniGameSymbol

      // Pick 3 random symbols for the 1x3 mini reel
      const miniReelSymbols = []
      for (let col = 0; col < 3; col++) {
        miniReelSymbols.push(this.getRandomGenerationUsingWeightTable({
          clientSeed: `${this.#clientSeed}-mini-reel-${col}-${result.length}`,
          serverSeed: this.#serverSeed,
          weightTable: freeGameMiniReelWeights
        }))
      }
      spinDetails.miniReel = miniReelSymbols

      // Check if the mini game symbol matches any in the mini reel
      const matches = miniReelSymbols.filter(symbol => symbol === miniGameSymbol).length
      spinDetails.numberOfMatches = matches

      spinDetails.globalMultiplier = globalMultiplier

      if (matches > 0) {
        const payout = freeGamePayouts[miniGameSymbol][matches]
        const winAmount = this.getPrecision(times(times(payout, globalMultiplier), this.#betAmount))
        spinDetails.winAmount = winAmount
        spinDetails.payout = payout
        totalWin = this.getPrecision(plus(winAmount, totalWin))
      } else {
        spinDetails.payout = 0
        spinDetails.winAmount = 0
      }

      spinDetails.totalWin = totalWin

      // Increase the spin count
      spinCount++

      // Update exit probability and global multiplier based on spin count
      if (spinCount > exitProbStopSpinCount) {
        exitProbStart = exitProbStop
      }

      if (spinCount % engineSettings.freeGameDoubleGlobalMultiplierInterval === 0) {
        globalMultiplier *= 2
      }
    }
  }

  formatFreeSpinResult ({ result, spinCount }) {
    const currentSpin = result[spinCount]

    const response = {
      CurrentWin: currentSpin.winAmount,
      AccWin: currentSpin.totalWin,
      Multiplier: currentSpin.payout,
      FreeSpin: {
        SelectedSymbol: engineSettings.symbolIdMap[currentSpin.selectedSymbol],
        Exit: currentSpin.exit,
        GlobalMultiplier: currentSpin.globalMultiplier,
        SpinNumber: currentSpin.spinNumber,
        SpinType: currentSpin.scatterCount
      },
      Type: 10
    }

    if (currentSpin.exit) {
      response.FreeSpin.Exit = currentSpin.exit
      response.Result = {
        R: '101,104,201|103,102,203|101,101,202|202,202,104|203,203,203'
      }
    } else {
      response.Result = {
        R: currentSpin.miniReel.map(symbol => engineSettings.symbolIdMap[symbol]).join('|')
      }
    }

    const next = result?.[spinCount + 1] ? { Type: 10, FreeSpinNo: (spinCount + 1) + 1 } : { Type: 1 }

    if (!currentSpin.payout) return { Current: response, Next: next }

    const wr = {
      R: `${currentSpin.payout},2,${currentSpin.numberOfMatches},${engineSettings.symbolIdMap[currentSpin.selectedSymbol]},1`,
      AWP: Array.from({ length: 3 }, () => new Set())
    }

    response.Result.WR = [wr]

    currentSpin.miniReel.forEach((symbol, index) => {
      if (symbol === currentSpin.selectedSymbol) wr.AWP[index].add(0)
    })

    wr.AWP = wr.AWP.map(data => [...data])

    return { Current: response, Next: next }
  }

  formatResult ({ result, type }) {
    let totalPayout = 0

    const formattedResult = {
      R: this.payWindowMatrix.flat().reduce((prev, symbol, index) => {
        prev += this.#symbolIdMap[symbol] + ((index % this.#windowSize.height) >> 0 === 2 ? '|' : ',')
        return prev
      }, '')
    }

    formattedResult.R = formattedResult.R.substring(0, formattedResult.R.length - 1)

    if (!result.length) return { formattedResult, totalPayout }

    const wr = {
      R: '',
      T: type,
      AWP: Array.from({ length: this.#windowSize.width }, () => new Set())
    }

    formattedResult.WR = [wr]

    result.forEach(winResult => {
      const totalSymbolMatched = winResult.matchedPatternIndexes.length

      const coinPayout = this.getPrecision(this.#betAmount * (this.#symbolMultiplier[winResult.symbol][totalSymbolMatched]))
      totalPayout = this.getPrecision(coinPayout + totalPayout)

      winResult.matchedPatternIndexes.forEach((value, index) => wr.AWP[index].add(value))

      wr.R += `${coinPayout},${winResult.patternNumber},${totalSymbolMatched},${this.#symbolIdMap[winResult.symbol]},${winResult.payDirection}|`
    })

    wr.AWP = wr.AWP.map(data => [...data])
    wr.R = wr.R.substring(0, wr.R.length - 1)

    return { formattedResult, totalPayout }
  }
}

export default new PayLineSlotGenerator({
  windowSize: { height: engineSettings.row, width: engineSettings.column },
  reels: engineSettings.reels,
  patterns: engineSettings.patterns,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbols: engineSettings.symbols
})
