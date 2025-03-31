import { EngineTwoController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineTwo.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineTwoRoutes = express.Router()

engineTwoRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineTwoController.preload,
  responseValidationMiddleware({})
)

engineTwoRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineTwoController.transact,
  responseValidationMiddleware({})
)

export { engineTwoRoutes }
