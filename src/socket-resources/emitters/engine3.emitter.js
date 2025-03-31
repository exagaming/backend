import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'
import socketEmitter from '../../libs/socketEmitter'

/**
 * @param {string} operatorId
 * @param {string} gameId
 * @param {object} payload
 */
export class Engine3GameEmitter {
  static betsInfo (operatorId, gameId, payload) {
    socketEmitter
      .of(SOCKET_NAMESPACES.ENGINE3_GAME).to(`/${operatorId}:${gameId}`)
      .emit(SOCKET_EMITTERS.ENGINE3_GAME_JACKPOT_INCREMENT_INFO, { data: payload })
  }

  static jackpotInfo (operatorId, gameId, payload) {
    socketEmitter
      .of(SOCKET_NAMESPACES.ENGINE3_GAME).to(`/${operatorId}:${gameId}`)
      .emit(SOCKET_EMITTERS.ENGINE3_GAME_JACKPOT_WIN_INFO, { data: payload })
  }
}
