import { Logger } from '@src/libs/logger'
import socketEmitter from '@src/libs/socketEmitter'
import { SOCKET_EMITTERS, SOCKET_NAMESPACES, SOCKET_ROOMS } from '@src/utils/constants/socket.constants'
import Flatted from 'flatted'

export class LiveChatsEmitter {
  static emitLiveChats (payload) {
    try {
      payload = Flatted.parse(Flatted.stringify(payload))
      const room = SOCKET_ROOMS.CHAT_NEW_MESSAGE + ':' + payload.operatorId + ':' + payload.chatLanguageId
      socketEmitter.of(SOCKET_NAMESPACES.CHAT).to(room).emit(SOCKET_EMITTERS.CHAT_NEW_MESSAGE, { data: payload })
    } catch (error) {
      Logger.info('LiveChatEmitter', { exception: error })
      throw error(error)
    }
  }
}
