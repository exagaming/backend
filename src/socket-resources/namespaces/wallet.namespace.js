import { SOCKET_NAMESPACES } from '@src/utils/constants/socket.constants'
import authenticationSocketNamespaceMiddleWare from '../middlewares/authenticationSocketNamespace.middleware'

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.WALLET)

  namespace.use(authenticationSocketNamespaceMiddleWare)

  namespace.on('connection', (socket) => {
    const room = `/${socket.auth.operatorId}:${socket.auth.userId}`
    socket.join(room)
  })
}
