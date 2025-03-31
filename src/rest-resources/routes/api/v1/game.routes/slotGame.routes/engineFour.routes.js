import { EngineFourController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineFour.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineFourRoutes = express.Router()

engineFourRoutes.route('/preload').post(
  requestValidationMiddleware(),
  EngineFourController.preload,
  responseValidationMiddleware({})
)

engineFourRoutes.route('/transact').post(
  requestValidationMiddleware(),
  EngineFourController.transact,
  responseValidationMiddleware({})
)

export { engineFourRoutes }
