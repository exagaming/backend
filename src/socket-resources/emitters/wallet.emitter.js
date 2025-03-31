import { SOCKET_EMITTERS, SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'
import socketEmitter from '../../libs/socketEmitter'

/**
 * Wallet Emitter for Emitting things related to the /wallet namespace
 *
 * @export
 * @class WalletEmitter
 */
export default class WalletEmitter {
  static emitUserWalletBalance (operatorId, userId, payload) {
    const room = `/${operatorId}:${userId}`
    socketEmitter.of(SOCKET_NAMESPACES.WALLET).to(room).emit(SOCKET_EMITTERS.WALLET_USER_WALLET_BALANCE, { data: payload })
  }
}
