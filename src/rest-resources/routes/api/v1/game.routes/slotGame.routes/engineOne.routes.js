import { EngineOneController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineOne.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineOneRoutes = express.Router()

engineOneRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineOneController.preload,
  responseValidationMiddleware()
)

engineOneRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineOneController.transact,
  responseValidationMiddleware()
)

export { engineOneRoutes }
