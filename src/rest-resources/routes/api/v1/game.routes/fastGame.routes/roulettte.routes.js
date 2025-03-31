import { RouletteGameController } from '@src/rest-resources/controllers/game.controller/rouletteGame.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const rouletteGameRoutes = express.Router()
const rouletteGameSchema = v1Schema.gameSchema.fastGameSchema.rouletteGameSchema

rouletteGameRoutes.get('/my-bets',
  RouletteGameController.getMyBets,
  responseValidationMiddleware(rouletteGameSchema.getMyBetsSchema)
)

rouletteGameRoutes.post('/place-bet',
  requestValidationMiddleware(rouletteGameSchema.placeBetSchema),
  RouletteGameController.placeBet,
  responseValidationMiddleware(rouletteGameSchema.placeBetSchema)
)

rouletteGameRoutes.post('/check-fairness',
  requestValidationMiddleware(rouletteGameSchema.checkFairnessSchema),
  RouletteGameController.checkFairness,
  responseValidationMiddleware(rouletteGameSchema.checkFairnessSchema)
)

export { rouletteGameRoutes }
