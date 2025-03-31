import { SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.SYSTEM)

  namespace.on('connection', (socket) => {

  })
}
