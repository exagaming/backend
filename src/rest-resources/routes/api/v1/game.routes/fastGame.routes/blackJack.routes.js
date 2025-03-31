import { BlackJackGameController } from '@src/rest-resources/controllers/game.controller/blackJack.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const blackJackGameRoutes = express.Router()
const blackJackGameSchema = v1Schema.gameSchema.fastGameSchema.blackjackGameSchema

blackJackGameRoutes.get('/get-unfinished-bet',
  BlackJackGameController.getUnfinishedBet,
  responseValidationMiddleware(blackJackGameSchema.getUnfinishedBetSchema)
)

blackJackGameRoutes.get('/get-my-bets',
  BlackJackGameController.getMyBets,
  responseValidationMiddleware(blackJackGameSchema.getMyBetsSchema)
)

blackJackGameRoutes.post('/place-bet',
  requestValidationMiddleware(blackJackGameSchema.placeBetSchema),
  BlackJackGameController.placeBet,
  responseValidationMiddleware(blackJackGameSchema.placeBetSchema)
)

blackJackGameRoutes.post('/place-double-bet',
  requestValidationMiddleware(blackJackGameSchema.placeDoubleBetSchema),
  BlackJackGameController.placeDoubleBet,
  responseValidationMiddleware(blackJackGameSchema.placeDoubleBetSchema)
)
blackJackGameRoutes.post('/place-split-bet',
  requestValidationMiddleware(blackJackGameSchema.placeSplitBetSchema),
  BlackJackGameController.placeSplitBet,
  responseValidationMiddleware(blackJackGameSchema.placeSplitBetSchema)
)

blackJackGameRoutes.post('/place-insurance-bet',
  requestValidationMiddleware(blackJackGameSchema.placeInsuranceBetSchema),
  BlackJackGameController.placeInsuranceBet,
  responseValidationMiddleware(blackJackGameSchema.placeInsuranceBetSchema)
)

blackJackGameRoutes.post('/hit',
  requestValidationMiddleware(blackJackGameSchema.hitSchema),
  BlackJackGameController.hit,
  responseValidationMiddleware(blackJackGameSchema.hitSchema)
)

blackJackGameRoutes.post('/stand',
  requestValidationMiddleware(blackJackGameSchema.standSchema),
  BlackJackGameController.stand,
  responseValidationMiddleware(blackJackGameSchema.standSchema)
)

blackJackGameRoutes.post('/check-fairness',
  requestValidationMiddleware(blackJackGameSchema.checkFairnessSchema),
  BlackJackGameController.checkFairness,
  responseValidationMiddleware(blackJackGameSchema.checkFairnessSchema)
)

export { blackJackGameRoutes }
