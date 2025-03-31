import { ChatController } from '@src/rest-resources/controllers/chat.controller'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const chatRoutes = express.Router()
const chatSchema = v1Schema.chatSchema

chatRoutes.get('/get-language-rooms',
  ChatController.getLanguageRooms,
  responseValidationMiddleware(chatSchema.getLanguageRoomsSchema)
)

chatRoutes.get('/get-messages',
  ChatController.getUserChat,
  responseValidationMiddleware(chatSchema.getMessagesSchema)
)

chatRoutes.post('/send-message',
  ChatController.sendUserMessage,
  responseValidationMiddleware(chatSchema.sendMessageSchema)
)

export { chatRoutes }
