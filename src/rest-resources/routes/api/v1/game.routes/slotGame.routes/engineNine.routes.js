
import { EngineNineController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineNine.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineNineRoutes = express.Router()

engineNineRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineNineController.preload,
  responseValidationMiddleware({})
)

engineNineRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineNineController.transact,
  responseValidationMiddleware({})
)

export { engineNineRoutes }
