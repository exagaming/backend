import { validateData } from '@src/helpers/ajv.helpers'
import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import socketEmitter from '@src/libs/socketEmitter'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'
import Flatted from 'flatted'

ajv.addSchema({
  type: 'object',
  properties: {
    bets: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
        createdAt: { type: 'string' },
        betAmount: { type: 'string' },
        winningAmount: { type: ['string', 'null'] },
        result: { type: 'string' },
        currencyId: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            userName: { type: 'string' }
          }
        },
        game: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' }
          }
        }
      }
    }
  }
}, 'emitBlackJackGameBet')

/**
 * BlackJack Game Emitter for Emitting things related to the /blackJack-game namespace
 *
 * @export
 * @class BlackJackGameEmitter
 */
export default class BlackJackGameEmitter {
  static async emitBlackJackGameBet (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const [isValid, errors] = validateData('emitBlackJackGameBet', payload)
      if (isValid) {
        socketEmitter.of(SOCKET_NAMESPACES.BLACKJACK_GAME).emit(SOCKET_EMITTERS.BLACKJACK_GAME_BET, { data: payload })
      } else {
        Logger.info('Error In Emitter', { message: 'Validation Error', fault: errors })
      }
    } catch (error) {
      Logger.info('Error In Emitter', { message: 'Error in Emitter while emitting on BlackJack Game Bets' })
      Logger.info('Actual Error', { exception: error })
    }
  }
}
