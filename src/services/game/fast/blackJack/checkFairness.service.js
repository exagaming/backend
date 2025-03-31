import { randomBlackJackDeck } from '@src/helpers/game.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    serverSeed: { type: 'string' },
    clientSeed: { type: 'string' }
  },
  required: ['serverSeed', 'clientSeed']
})

export class CheckFairnessService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const cardDeck = randomBlackJackDeck(this.args.clientSeed, this.args.serverSeed)
    return cardDeck
  }
}
