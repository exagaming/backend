                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import { EngineTherteenController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineTherteen.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineTherteenRoutes = express.Router()

engineTherteenRoutes.post('/preload',
  requestValidationMiddleware(),
  EngineTherteenController.preload,
  responseValidationMiddleware()
)

engineTherteenRoutes.post('/transact',
  requestValidationMiddleware(),
  EngineTherteenController.transact,
  responseValidationMiddleware()
)

export { engineTherteenRoutes }
