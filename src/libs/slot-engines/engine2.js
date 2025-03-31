import engineSettings from '@src/libs/slot-engines/data/engine2Settings'
import SlotBase from '@src/libs/slotBase'
import _ from 'lodash'

/**
 * @typedef {String} Symbol
 *
 * @typedef {Array<string>} Reel
 *
 * @typedef {Array<number>} Pattern
 *
 * @typedef {Object.<string, Pattern>} Patterns
 *
 * @typedef {Array<string>} PayWindow
 *
 * @typedef {Object.<string, number>} SymbolIdMap
 *
 * @typedef {Object.<string, Object.<string, number>>} SymbolMultiplier
 *
 * @typedef WindowSize
 * @property {number} width
 * @property {number} height
 */
class PayLineSlotGenerator extends SlotBase {
  /** @type {Reel[]} */
  #reels = []

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

  /**
   * @param {WindowSize} windowSize
   * @param {Reel[]} reels
   * @param {Patterns} patterns
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reels, patterns, symbolIdMap, symbolMultiplier }) {
    super()
    this.#reels = reels
    this.#patterns = patterns
    this.#windowSize = windowSize
    this.#symbolIdMap = symbolIdMap
    this.#symbolMultiplier = symbolMultiplier
    this.#symbols = Object.keys(symbolMultiplier)

    this.#validateData()
  }

  init ({ clientSeed, serverSeed }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
  }

  generate () {
    const { payWindow, symbolOccurrence } = this.#generatePayWindow()
    const result = this.#checkPatterns({ payWindow, symbolOccurrence })
    return { result, payWindow }
  }

  generateMultiplier () {
    return this.getRandomGenerationUsingWeightTable({
      serverSeed: this.#serverSeed,
      clientSeed: `${this.#clientSeed}-generate-multiplier`,
      weightTable: engineSettings.multiplierWeights
    })
  }

  #generatePayWindow () {
    let payWindow = []
    let symbolOccurrence = {}

    for (let i = 0; i < this.#windowSize.width; i++) {
      const reel = this.#reels[i]

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

    // filter symbols which count >= minSymbolNeeded
    symbolOccurrence = Object.entries(symbolOccurrence)
      .filter(([key, value]) => value >= this.#minimumSymbolOccurrence)
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})

    this.payWindowMatrix = payWindow

    payWindow = this.transpose(payWindow).flat()

    return { payWindow, symbolOccurrence }
  }

  /**
   * @param {PayWindow} payWindow
   * @param {Object.<string, number>} symbolOccurrence
   * @returns
   */
  #checkPatterns ({ payWindow, symbolOccurrence }) {
    const result = []
    Object.keys(this.#patterns).forEach(patternNumber => {
      for (const symbol in symbolOccurrence) {
        // Left to Right match
        let matchedData = this.#patternMatched({ symbol, payWindow, patternNumber, payDirection: engineSettings.payDirection.leftToRight })
        // Right to Left match
        if (!matchedData.matched) matchedData = this.#patternMatched({ symbol, payWindow, patternNumber, payDirection: engineSettings.payDirection.rightToLeft })
        if (matchedData.matched) result.push(matchedData)
      }
    })

    return result
  }

  #patternMatched ({ symbol, payWindow, patternNumber, payDirection }) {
    const pattern = payDirection === engineSettings.payDirection.leftToRight ? this.#patterns[patternNumber] : [...this.#patterns[patternNumber]].reverse()
    const matchedPatternIndexes = []

    for (const index in pattern) {
      if (payWindow[pattern[index]] !== symbol) break
      matchedPatternIndexes.push(Math.floor(pattern[index] / engineSettings.column))
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
    if (this.#windowSize.width !== this.#reels.length) throw Error('Window width and number of reels mismatch')
    this.#reels.forEach(reel => {
      reel.forEach(symbol => {
        if (!this.#symbols.includes(symbol)) throw Error(`Symbol map does not contain reel symbol ${symbol}`)
      })
    })
  }

  formatResult ({ result, type, multiplier, betAmount }) {
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
      const coinPayout = this.getPrecision(betAmount * (this.#symbolMultiplier[winResult.symbol][totalSymbolMatched]))
      totalPayout = this.getPrecision(coinPayout + totalPayout)

      winResult.matchedPatternIndexes.forEach((value, index) => wr.AWP[index].add(value))

      wr.R += `${coinPayout},${winResult.patternNumber},${totalSymbolMatched},${multiplier},${this.#symbolIdMap[winResult.symbol]},${winResult.payDirection}|`
    })

    wr.AWP = wr.AWP.map(data => [...data])
    wr.R = wr.R.substring(0, wr.R.length - 1)

    return { formattedResult, totalPayout: this.getPrecision(totalPayout * multiplier) }
  }
}

export const engine2 = new PayLineSlotGenerator({
  windowSize: { height: engineSettings.row, width: engineSettings.column },
  reels: engineSettings.reels,
  patterns: engineSettings.patterns,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier
})
