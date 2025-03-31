import { SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'

/**
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.CRASH_GAME)

  namespace.on('connection', (socket) => {
    const room = `/${socket.handshake.query.operatorId}:${socket.handshake.query.gameId}`
    socket.join(room)
  })
}
