import { EngineTwelveController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineTwelve.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineTwelveRoutes = express.Router()

engineTwelveRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineTwelveController.preload,
  responseValidationMiddleware({})
)

engineTwelveRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineTwelveController.transact,
  responseValidationMiddleware({})
)

export { engineTwelveRoutes }
