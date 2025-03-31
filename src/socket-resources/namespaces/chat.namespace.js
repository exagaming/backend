import { SOCKET_LISTENERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '@src/utils/constants/socket.constants'
import { socketSchemaBuilder } from '../../helpers/ajv.helpers'
import authenticationSocketNamespaceMiddleWare from '../middlewares/authenticationSocketNamespace.middleware'
import contextSocketMiddleware from '../middlewares/contextSocket.middleware'
import requestValidationSocketMiddleware from '../middlewares/requestValidationSocket.middleware'
// import authenticationSocketNamespaceMiddleWare from '../middlewares/authenticationSocketNamespace.middleware'

const socketSchemas = {
  [SOCKET_LISTENERS.CHAT_SEND_NEW_MESSAGE]: {
    request: {},
    response: {}
  }
}

/**
 *
 *
 * @export
 * @param {import('socket.io').Server} io
 */
export default function (io) {
  const namespace = io.of(SOCKET_NAMESPACES.CHAT)

  namespace.use(authenticationSocketNamespaceMiddleWare)

  const compiledSchemas = socketSchemaBuilder(socketSchemas)

  namespace.on('connection', (socket) => {
    socket.use(contextSocketMiddleware(socket, compiledSchemas || {}))
    socket.use(requestValidationSocketMiddleware)

    const room = SOCKET_ROOMS.CHAT_NEW_MESSAGE + ':' + socket.auth.operatorId + ':' + socket.handshake.query.chatLanguageId
    socket.join(room)
    socket.room = room
    socket.on(SOCKET_LISTENERS.CHAT_CHANGE_CHAT_ROOM, (reqData) => {
      socket.leave(socket.room)
      socket.room = SOCKET_ROOMS.CHAT_NEW_MESSAGE + ':' + socket.auth.operatorId + ':' + reqData.payload.languageId
      socket.join(socket.room)
    })
  })
}
