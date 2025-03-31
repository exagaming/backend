import { EngineThreeController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineThree.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineThreeRoutes = express.Router()

engineThreeRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineThreeController.preload,
  responseValidationMiddleware({})
)

engineThreeRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineThreeController.transact,
  responseValidationMiddleware({})
)

export { engineThreeRoutes }
