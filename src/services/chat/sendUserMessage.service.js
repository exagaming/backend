import ajv from '@src/libs/ajv'
import { serverDayjs } from '@src/libs/day'
import ServiceBase from '@src/libs/serviceBase'
import { LiveChatsEmitter } from '@src/socket-resources/emitters/chat.emitter'
import { messageContainsOffensiveWords, messagesContainsURL } from '@src/utils/chat.utils'
import { DELETED_MESSAGE, MAX_CHAT_CHARACTERS, URL_CHAT_MESSAGE } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import { GetOffensiveWordsListService } from '../common/getOffensiveWordsList.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    operatorId: { type: 'string' },
    message: { type: 'string' },
    chatLanguageId: { type: 'number' },
    gameId: { type: 'string' }
  },
  required: ['message', 'userId', 'operatorId', 'gameId', 'chatLanguageId']
})

export class SendUserMessageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { message, chatLanguageId, operatorId, userId, gameId } = this.args
    const {
      dbModels: {
        User: UserModel,
        UserChat: UserChatModel
      },
      sequelizeTransaction
    } = this.context

    try {
      const userDetail = await UserModel.findOne({
        attributes: ['isBlockChatPermanently', 'blockChatTillDate', 'userName'],
        where: { id: userId },
        raw: true
      })

      if (userDetail.isBlockChatPermanently || serverDayjs().isAfter(userDetail.blockChatTillDate)) throw messages.USER_BLOCKED_FROM_SENDING_MESSAGES
      if (message.length > MAX_CHAT_CHARACTERS) throw messages.EXCEEDS_MESSAGE_LENGTH

      const offensiveWords = await GetOffensiveWordsListService.run({ operatorId }, this.context)
      const containsUrl = messagesContainsURL(message)
      const containOffensiveWords = messageContainsOffensiveWords(message, offensiveWords)

      const userChat = await UserChatModel.create({
        userId,
        gameId,
        chatLanguageId,
        containOffensiveWords,
        message: containsUrl ? URL_CHAT_MESSAGE : message
      }, { transaction: sequelizeTransaction })

      LiveChatsEmitter.emitLiveChats({
        operatorId,
        chatLanguageId,
        id: userChat.id,
        containOffensiveWords,
        createdAt: userChat.createdAt,
        user: { id: userId, userName: userDetail.userName },
        message: containOffensiveWords ? containsUrl ? URL_CHAT_MESSAGE : DELETED_MESSAGE : message
      })

      return { containOffensiveWords }
    } catch (error) {
      throw Error(error)
    }
  }
}
