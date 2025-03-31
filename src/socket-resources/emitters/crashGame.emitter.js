import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'
import socketEmitter from '../../libs/socketEmitter'

/**
 * @param {string} operatorId
 * @param {string} gameId
 * @param {object} payload
 */
export class CrashGameEmitter {
  static betsInfo (operatorId, gameId, payload) {
    socketEmitter.of(SOCKET_NAMESPACES.CRASH_GAME).to(`/${operatorId}:${gameId}`).emit(SOCKET_EMITTERS.CRASH_GAME_BETS_INFO, { data: payload })
  }
}
