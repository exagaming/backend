import { CommonController } from '@src/rest-resources/controllers/common.controller'
import { authenticationMiddleWare } from '@src/rest-resources/middlewares/authentication.middleware'
import { checkGameStatusMiddleware } from '@src/rest-resources/middlewares/checkGameStatus.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'
import { chatRoutes } from './chat.routes'
import { commonRoutes } from './common.routes'
import { gameRouter } from './game.routes'
import { operatorRoutes } from './operator.routes'
import { userRoutes } from './user.routes'

const v1Router = express.Router()

v1Router.use('/user', userRoutes)
v1Router.use('/operator', operatorRoutes)
v1Router.use('/chat', authenticationMiddleWare, chatRoutes)
v1Router.use('/common', authenticationMiddleWare, commonRoutes)
v1Router.use('/game', authenticationMiddleWare, checkGameStatusMiddleware, gameRouter)

v1Router.post('/SdqfkbwA8Q/temp/retry', CommonController.tempRetryBet, responseValidationMiddleware({}))

export { v1Router }
