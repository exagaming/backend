import { PlinkoGameController } from '@src/rest-resources/controllers/game.controller/plinko.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const plinkoGameRoutes = express.Router()
const plinkoGameSchema = v1Schema.gameSchema.fastGameSchema.plinkoGameSchema

plinkoGameRoutes.get('/my-bets',
  PlinkoGameController.getMyBets,
  responseValidationMiddleware(plinkoGameSchema.getMyBetsSchema)
)

plinkoGameRoutes.post('/place-bet',
  requestValidationMiddleware(plinkoGameSchema.placeBetSchema),
  PlinkoGameController.placeBet,
  responseValidationMiddleware(plinkoGameSchema.placeBetSchema)
)

plinkoGameRoutes.post('/check-fairness',
  requestValidationMiddleware(plinkoGameSchema.checkFairnessSchema),
  PlinkoGameController.checkFairness,
  responseValidationMiddleware(plinkoGameSchema.checkFairnessSchema)
)

export { plinkoGameRoutes }
