import { CrashController } from '@src/rest-resources/controllers/game.controller/crashGame.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const crashGameRoutes = express.Router()
const crashGameSchema = v1Schema.gameSchema.crashGameSchema

crashGameRoutes.get('/get-history',
  requestValidationMiddleware(crashGameSchema.getHistorySchema),
  CrashController.getHistory,
  responseValidationMiddleware(crashGameSchema.getHistorySchema)
)

crashGameRoutes.get('/my-bets',
  requestValidationMiddleware(crashGameSchema.getMyBetsSchema),
  CrashController.getMyBets,
  responseValidationMiddleware(crashGameSchema.getMyBetsSchema)
)

crashGameRoutes.get('/top-bets',
  requestValidationMiddleware(crashGameSchema.getTopBetsSchema),
  CrashController.getTopBets,
  responseValidationMiddleware(crashGameSchema.getTopBetsSchema)
)

crashGameRoutes.post('/place-bet',
  requestValidationMiddleware(crashGameSchema.placeBetSchema),
  CrashController.placeBet,
  responseValidationMiddleware(crashGameSchema.placeBetSchema)
)

crashGameRoutes.post('/cancel-bet',
  requestValidationMiddleware(crashGameSchema.cancelBetSchema),
  CrashController.cancelBet,
  responseValidationMiddleware(crashGameSchema.cancelBetSchema)
)

crashGameRoutes.post('/player-escape',
  requestValidationMiddleware(crashGameSchema.escapeBetSchema),
  CrashController.playerEscape,
  responseValidationMiddleware(crashGameSchema.escapeBetSchema)
)

crashGameRoutes.post('/check-fairness',
  requestValidationMiddleware(crashGameSchema.checkFairnessSchema),
  CrashController.checkFairness,
  responseValidationMiddleware(crashGameSchema.checkFairnessSchema)
)

export { crashGameRoutes }
