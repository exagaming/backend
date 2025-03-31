import crypto from 'crypto'

class SlotBase {
  rng (lowerLimit, upperLimit) {
    return Math.floor((Math.random() * upperLimit) + lowerLimit)
  }

  generateRandomNumber ({ clientSeed, serverSeed, maxNumber }) {
    const decimal = this.generateRandomDecimal({
      clientSeed,
      serverSeed,
      maxNumber
    })
    return parseInt(decimal) + 1 // Number will be generated in [1, maxNumber]
  }

  transpose (matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
  }

  generateRandomDecimal ({ clientSeed, serverSeed, maxNumber }) {
    const nBits = 32 // number of most significant bits to use

    const hmac = crypto.createHmac('sha256', serverSeed)
    hmac.update(`${clientSeed}`)

    let seed = hmac.digest('hex')
    seed = seed.slice(0, nBits / 4) // For more variability we are using 16 bits

    const decimalNumber = parseInt(seed, 16)

    const probability = decimalNumber / Math.pow(2, nBits) // uniformly distributed in [0; 1)

    const number = probability * maxNumber // Number will be generated in [0,maxNumber)

    return number
  }

  getRandomGenerationUsingWeightTable ({ weightTable, clientSeed, serverSeed }) {
    const keys = Object.keys(weightTable)
    const weights = Object.values(weightTable).map(k => +k)
    let totalWeight = 0

    let cumulativeWeights = [...weights]

    for (let i = 0; i < weights.length; i++) {
      totalWeight += weights[i]
      if (i > 0) {
        cumulativeWeights[i] += cumulativeWeights[i - 1]
      }
    }
    cumulativeWeights = cumulativeWeights.map(weight => weight / totalWeight)
    const samplingNumber = this.generateRandomDecimal({
      clientSeed,
      serverSeed,
      maxNumber: 1
    })
    const index = cumulativeWeights.findIndex(weight => samplingNumber < weight)

    return keys[index === -1 ? 0 : index]
  }

  getPrecision (value, precision = 2) {
    const precisionDivide = 10 ** precision
    const result = parseInt(value * precisionDivide) / precisionDivide
    return result || 0
  }

  /**
   *
   * @param  {...Array} a Specify arrays to do cartesian product
   * @returns {Array.<Array.<number[]>>} Returns the cartesian product of given arrays
   */
  cartesianProductOfArrays (...a) {
    return a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())))
  }
}

export default SlotBase
