import { EngineSixController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineSix.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineSixRoutes = express.Router()

engineSixRoutes.route('/preload').post(
  requestValidationMiddleware(),
  EngineSixController.preload,
  responseValidationMiddleware({})
)

engineSixRoutes.route('/transact').post(
  requestValidationMiddleware(),
  EngineSixController.transact,
  responseValidationMiddleware({})
)

export { engineSixRoutes }
