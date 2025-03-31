import { ServiceError } from '@src/errors/service.error'
import { plinkoGameResult } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'
import { PLINKO_FIXED_ODDS } from '@src/utils/constants/plinko.constants'
import { getPrecision } from '@src/utils/math.utils'
import _ from 'lodash'
import { divide, minus, times } from 'number-precision'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    clientSeed: { type: 'string' },
    serverSeed: { type: 'string' }
  },
  required: ['clientSeed', 'serverSeed']
})

export class CheckFairnessService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { clientSeed, serverSeed } = this.args

    try {
      const bet = await this.context.dbModels.PlinkoGameBet.findOne({ where: { clientSeed, serverSeed }, raw: true })
      if (!bet) throw messages.INVALID_SEED

      const winningSlots = []
      const dropDetails = []
      const multipliers = []
      const gameSettings = bet.currentGameSettings
      const selectedOdds = PLINKO_FIXED_ODDS[bet.numberOfRows][(bet.riskLevel === 4 ? 2 : bet.riskLevel - 1)]

      for (let currentBall = 1; currentBall <= bet.numberOfBalls; currentBall++) {
        const result = plinkoGameResult(clientSeed.concat(`-${currentBall}`), serverSeed, bet.numberOfRows)
        const totalCountOfOneChar = _.reduce(result, (count, char) => char === '1' ? ++count : count, 0)

        // INFO: Actual odds are calculated based on houseEdge using fixed odds
        // INFO: And if odd is greater then 10, need to increase the value by 1, because below formula won't work perfectly for values greater then 10
        let actualOdd = Math.max(0.1, +getPrecision(times(selectedOdds[totalCountOfOneChar], minus(1, divide(gameSettings.houseEdge, 100))), 1))
        actualOdd = actualOdd > 10 ? Math.floor(actualOdd) + 1 : actualOdd

        dropDetails.push(result)
        winningSlots.push(totalCountOfOneChar)
        multipliers.push(actualOdd)
      }

      return { winningSlots, dropDetails, multipliers, numberOfRows: bet.numberOfRows }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
