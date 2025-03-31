import { EngineFiveController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineFive.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineFiveRoutes = express.Router()

engineFiveRoutes.route('/preload').post(
  requestValidationMiddleware(),
  EngineFiveController.preload,
  responseValidationMiddleware({})
)

engineFiveRoutes.route('/transact').post(
  requestValidationMiddleware(),
  EngineFiveController.transact,
  responseValidationMiddleware({})
)

export { engineFiveRoutes }
