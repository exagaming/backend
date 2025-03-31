import engineSettings from '@src/libs/slot-engines/data/engine3Settings'
import SlotBase from '@src/libs/slotBase'
import _ from 'lodash'

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

  /** @type {MinimumSymbolOccurrence} */
  #minimumSymbolOccurrence = {}

  /** @type {SymbolPayType} */
  #symbolPayType = {}

  /** @type {string} */
  #clientSeed = ''

  /** @type {string} */
  #serverSeed = ''

  /** @type {number} */
  #betAmount = 0

  /** @type {string} */
  #betType = ''

  /** @type {JackpotValues} */
  #jackpotValues = {}

  /**
   * @param {WindowSize} windowSize
   * @param {Reel[]} reels
   * @param {Patterns} patterns
   * @param {SymbolIdMap} symbolIdMap
   * @param {SymbolMultiplier} symbolMultiplier
   */
  constructor ({ windowSize, reels, patterns, symbolIdMap, symbolMultiplier, symbols, minimumSymbolOccurrence, symbolPayType }) {
    super()
    this.#reels = reels
    this.#patterns = patterns
    this.#windowSize = windowSize
    this.#symbolIdMap = symbolIdMap
    this.#symbolMultiplier = symbolMultiplier
    this.#symbols = symbols
    this.#minimumSymbolOccurrence = minimumSymbolOccurrence
    this.#symbolPayType = symbolPayType
    this.#validateData()
  }

  #validateData () {
    Object.keys(this.#reels).forEach((reelNumber) => {
      if (this.#windowSize.width !== this.#reels[reelNumber].length) throw Error('Window width and number of reels mismatch')
      this.#reels[reelNumber].forEach((reel) => {
        reel.forEach((symbol) => {
          if (!this.#symbols.includes(symbol)) throw Error(`Symbol map does not contain reel symbol ${symbol}`)
        })
      })
    })
  }

  init ({ clientSeed, serverSeed, betAmount, BetType }) {
    this.#clientSeed = clientSeed
    this.#serverSeed = serverSeed
    this.#betAmount = betAmount
    this.#betType = BetType
  }

  generate () {
    const reelNumber = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-select-reel`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.baseGameReelWeights
    })
    const { payWindow, symbolOccurrence } = this.#generatePayWindow({
      reelSet: this.#reels[reelNumber]
    })
    const result = this.#getAllMatchingData({ symbolOccurrence, payWindow })
    const jackpotEnabled = this.#generateJackpotInitiate()
    return { result, jackpotEnabled }
  }

  #generateJackpotInitiate () {
    const jackpotEnabled = +this.getRandomGenerationUsingWeightTable({
      clientSeed: this.#clientSeed,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.jackpotBetTriggerWeights[this.#betType]
    })
    return Boolean(jackpotEnabled)
  }

  playGamble ({ spinNumber, selectedColor, amount }) {
    const symbol = this.getRandomGenerationUsingWeightTable({
      clientSeed: `${this.#clientSeed}-gamble--spin-${spinNumber}`,
      serverSeed: this.#serverSeed,
      weightTable: engineSettings.gambleWeights
    })
    const winColor = engineSettings.gambleColors[symbol]
    const output = { amount: winColor === selectedColor ? +amount * 2 : 0, symbol }
    return output
  }

  playJackpot () {
    const spins = { max: engineSettings.maxJackpotSpins, min: engineSettings.minJackpotSpins }
    const weightTable = _.cloneDeep(engineSettings.jackpotPickupWeightValues[this.#betType])

    const result = []
    const jackpotOccurrence = {}

    let jackpotWinType = null
    const upgradeData = { upgrade: false, jackpotTypeWithoutUpgrade: null }

    for (let i = 0; i < spins.max; i++) {
      const jackpotType = this.getRandomGenerationUsingWeightTable({
        clientSeed: `${this.#clientSeed}-spin-${i}`,
        serverSeed: this.#serverSeed,
        weightTable
      })
      weightTable[jackpotType] = 0 // make weight 0

      const jackpotPrimaryType = jackpotType.split(engineSettings.separator)[0]
      if (jackpotType.indexOf(engineSettings.upgradeSymbol) > -1) {
        jackpotOccurrence[jackpotType] = 1

        result.push({ jackpotType, index: null, hit: false, upgrade: false, upgradeTo: '' })
      } else {
        jackpotOccurrence[jackpotPrimaryType] = (jackpotOccurrence[jackpotPrimaryType] || 0) + 1

        result.push({ jackpotType: jackpotPrimaryType, index: null, hit: false, upgrade: false, upgradeTo: '' })
      }

      if (i > spins.min - 2) {
        if (jackpotOccurrence[jackpotPrimaryType] === spins.min) {
          jackpotWinType = jackpotPrimaryType
          upgradeData.jackpotTypeWithoutUpgrade = jackpotPrimaryType

          result[i] = { ...result[i], hit: true }

          if (jackpotOccurrence[`${jackpotPrimaryType}${engineSettings.separator}${engineSettings.upgradeSymbol}`]) {
            jackpotWinType = engineSettings.jackpotUpgradeType[jackpotWinType]
            upgradeData.upgrade = true
            result[i] = { ...result[i], upgrade: true, upgradeTo: jackpotWinType }
          }

          break // jackpot won
        }
      }
    }

    const jackpotResponse = {
      amount: 0,
      jackpotTypeWithoutUpgrade: upgradeData.jackpotTypeWithoutUpgrade,
      result,
      upgrade: upgradeData.upgrade,
      upgradeTo: upgradeData.upgrade ? jackpotWinType : ''
    }

    return jackpotResponse
  }

  incrementJackpotAmounts (jackpotValues) {
    const input = _.cloneDeep(jackpotValues)
    for (const jackpot in input) {
      input[jackpot].value += engineSettings.jackpotStartupAndIncrementValues[jackpot].increment
      input[jackpot].value = parseFloat(input[jackpot].value.toFixed(3))
    }

    return input
  }

  restartJackpot (jackpotType, jackpotValues) {
    const input = _.cloneDeep(jackpotValues)
    input[jackpotType].value = engineSettings.jackpotStartupAndIncrementValues[jackpotType].value

    return input
  }

  #generatePayWindow ({ reelSet }) {
    let payWindow = []
    let symbolOccurrence = {}

    for (let i = 0; i < this.#windowSize.width; i++) {
      const reel = reelSet[i]

      const randIndex =
        this.generateRandomNumber({
          clientSeed: `${this.#clientSeed}-reel-number-${i}`,
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

    this.payWindowMatrix = payWindow

    const { hasWildSymbol, payWindowCopy } = this.#expandWildSymbols(payWindow)
    if (hasWildSymbol) {
      payWindow = payWindowCopy
      symbolOccurrence = this.#calculateSymbolOccurrence(payWindow)
    }

    payWindow = this.transpose(payWindow).flat()

    return { payWindow, symbolOccurrence }
  }

  #calculateSymbolOccurrence (payWindow) {
    return payWindow.flat().reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1
      return acc
    }, {})
  }

  #expandWildSymbols (payWindow) {
    const payWindowCopy = _.cloneDeep(payWindow)
    let hasWildSymbol = false
    for (let i = 0; i < payWindow.length; i++) {
      if (payWindowCopy[i].includes('WILD')) {
        hasWildSymbol = true
        payWindowCopy[i].fill(engineSettings.specialSymbol.EXPAND)
      }
    }
    return { hasWildSymbol, payWindowCopy }
  }

  #getAllMatchingData ({ symbolOccurrence, payWindow }) {
    const patternsMatched = this.#checkPatterns({ symbolOccurrence, payWindow })
    const countsMatched = this.#checkCounts({ symbolOccurrence, payWindow })
    return _.cloneDeep([...patternsMatched, ...countsMatched])
  }

  #checkPatterns ({ symbolOccurrence, payWindow }) {
    let result = []
    const excludeSymbols = new Set(Object.values(engineSettings.specialSymbol))

    Object.keys(this.#patterns).forEach((patternNumber) => {
      for (const symbol in symbolOccurrence) {
        if (excludeSymbols.has(symbol)) continue
        let matchedData
        if (this.#symbolPayType.line.includes(symbol)) {
          // Left to Right match
          matchedData = this.#patternMatched({
            symbol,
            payWindow,
            patternNumber,
            payDirection: engineSettings.payDirection.leftToRight
          })
        }
        if (matchedData.matched) result.push(matchedData)
      }
    })

    result = this.#filterMaxPayout(result, 'patternNumber')

    return result
  }

  #checkCounts ({ symbolOccurrence, payWindow }) {
    let result = []
    let matchedData
    for (const symbol in symbolOccurrence) {
      if (this.#symbolPayType.scatter.includes(symbol)) {
        matchedData = this.#countMatched({ symbol, payWindow })
        if (matchedData.matched) result.push(matchedData)
      }
    }

    result = this.#filterMaxPayout(result, 'symbol')

    return result
  }

  #countMatched ({ symbol, payWindow }) {
    const count = payWindow.reduce((count, entity) => (entity === symbol ? ++count : count), 0)
    const matched = Boolean(this.#symbolMultiplier[symbol][count])
    let payout = 0
    if (matched) {
      payout = this.#symbolMultiplier[symbol][count] * this.#betAmount
    }

    return {
      symbol,
      matchedCount: count,
      payout,
      matched
      // default values
      // payDirection,
      // patternNumber,
      // matchedPatternIndexes,
      // pattern: this.#patterns[patternNumber],
    }
  }

  #filterMaxPayout (arr, targetKey) {
    const patternMap = new Map()

    arr.forEach((item) => {
      const key = item[targetKey]
      if (!patternMap.has(key)) {
        patternMap.set(key, item)
      } else {
        const existingItem = patternMap.get(key)
        const itemWin = item.payout
        const existingWin = existingItem.payout
        if (itemWin > existingWin) {
          patternMap.set(key, item)
        }
      }
    })

    return Array.from(patternMap.values())
  }

  #patternMatched ({ symbol, payWindow, patternNumber, payDirection }) {
    const pattern = this.#patterns[patternNumber]
    const matchedPatternIndexes = []
    const validSymbols = new Set([symbol, engineSettings.specialSymbol.WILD, engineSettings.specialSymbol.EXPAND])
    const patternSymbolArray = []

    for (const index of pattern) {
      if (validSymbols.has(payWindow[index])) {
        matchedPatternIndexes.push(Math.floor(index / engineSettings.column))
        patternSymbolArray.push(payWindow[index])
      } else {
        break
      }
    }

    const matchLength = matchedPatternIndexes.length
    const { payout, matched } = this.#calculatePayout(symbol, matchLength)

    return {
      symbol,
      patternNumber,
      payDirection,
      matchedPatternIndexes,
      patternSymbolArray,
      pattern: this.#patterns[patternNumber],
      payout,
      matched
    }
  }

  #calculatePayout (symbol, matchLength) {
    const symbolMultiplier = this.#symbolMultiplier[symbol]
    const specialSymbolMinOccurrenceArray = Object.keys(this.#minimumSymbolOccurrence.special)
    const specialSymbolMinOccurrence = new Set(specialSymbolMinOccurrenceArray).has(symbol)

    if (specialSymbolMinOccurrence && matchLength >= this.#minimumSymbolOccurrence.special[symbol]) {
      return { payout: symbolMultiplier[matchLength] * this.#betAmount, matched: true }
    } else if (matchLength >= this.#minimumSymbolOccurrence.base) {
      return { payout: symbolMultiplier[matchLength] * this.#betAmount, matched: true }
    }

    return { payout: 0, matched: false }
  }

  formatResult ({ result, type }) {
    let totalPayout = 0

    const formattedResult = {
      R: this.payWindowMatrix.flat().reduce((prev, symbol, index) => {
        prev += this.#symbolIdMap[symbol] + (index % this.#windowSize.height >> 0 === 2 ? '|' : ',')
        return prev
      }, ''),
      S: []
    }

    formattedResult.R = formattedResult.R.substring(0, formattedResult.R.length - 1)

    if (!result.length) return { formattedResult, totalPayout }

    const expand = new Array(this.payWindowMatrix.length).fill(0)

    const wr = {
      R: '',
      T: type,
      AWP: Array.from({ length: this.#windowSize.width }, () => [])
    }

    formattedResult.WR = [wr]

    result.forEach((winResult) => {
      if (this.#symbolPayType.line.includes(winResult.symbol)) {
        const totalSymbolMatched = winResult.matchedPatternIndexes.length

        const coinPayout = this.getPrecision(this.#betAmount * this.#symbolMultiplier[winResult.symbol][totalSymbolMatched])
        totalPayout = this.getPrecision(coinPayout + totalPayout)

        winResult.patternSymbolArray.forEach((symbol, index) => {
          if (symbol === engineSettings.specialSymbol.EXPAND) {
            expand[index] = 1
          }
        })

        winResult.matchedPatternIndexes.forEach((value, index) => wr.AWP[index].push(value))

        wr.R += `${coinPayout},${winResult.patternNumber},${totalSymbolMatched},${this.#symbolIdMap[winResult.symbol]},${winResult.payDirection}|`
      } else if (this.#symbolPayType.scatter.includes(winResult.symbol)) {
        const totalCount = winResult.matchedCount

        const coinPayout = this.getPrecision(this.#betAmount * this.#symbolMultiplier[winResult.symbol][totalCount])

        totalPayout = this.getPrecision(coinPayout + totalPayout)

        formattedResult.S.push({
          type: this.#symbolIdMap[winResult.symbol],
          count: totalCount,
          payout: coinPayout
        })
      }
    })

    formattedResult.E = expand
    wr.R = wr.R.substring(0, wr.R.length - 1)

    return { formattedResult, totalPayout }
  }
}

const engine3 = new PayLineSlotGenerator({
  windowSize: { height: engineSettings.row, width: engineSettings.column },
  reels: engineSettings.reels,
  patterns: engineSettings.patterns,
  symbolIdMap: engineSettings.symbolIdMap,
  symbolMultiplier: engineSettings.symbolMultiplier,
  symbols: engineSettings.symbols,
  minimumSymbolOccurrence: engineSettings.minimumSymbolOccurrence,
  symbolPayType: engineSettings.symbolPayType
})

export default engine3
