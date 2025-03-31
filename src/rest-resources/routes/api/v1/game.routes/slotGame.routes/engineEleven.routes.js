import { EngineElevenController } from '@src/rest-resources/controllers/game.controller/slot.controller/engineEleven.controller'
import { authenticationMiddleWare } from '@src/rest-resources/middlewares/authentication.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import express from 'express'

const engineElevenRoutes = express.Router()

engineElevenRoutes.post('/preload',
  authenticationMiddleWare,
  EngineElevenController.preload,
  responseValidationMiddleware()
)

engineElevenRoutes.post('/transact',
  authenticationMiddleWare,
  EngineElevenController.transact,
  responseValidationMiddleware()
)

export { engineElevenRoutes }
