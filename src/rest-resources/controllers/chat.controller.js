import { sendResponse } from '@src/helpers/response.helpers'
import { GetLanguageRoomService } from '@src/services/chat/getLanguageRoom.service'
import { GetUserChatService } from '@src/services/chat/getUserChat.service'
import { SendUserMessageService } from '@src/services/chat/sendUserMessage.service'

export class ChatController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUserChat (req, res, next) {
    try {
      const result = await GetUserChatService.execute({ ...req.query, userId: req.context.auth.id }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getLanguageRooms (req, res, next) {
    try {
      const result = await GetLanguageRoomService.execute(req.query, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async sendUserMessage (req, res, next) {
    try {
      const result = await SendUserMessageService.execute({ ...req.body, userId: req.context.auth.userId, operatorId: req.context.auth.operatorId }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
