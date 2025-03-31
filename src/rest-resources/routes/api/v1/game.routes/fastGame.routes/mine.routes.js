import { MineGameController } from '@src/rest-resources/controllers/game.controller/mineGame.controller'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const mineGameRoutes = express.Router()
const mineGameSchema = v1Schema.gameSchema.fastGameSchema.mineGameSchema

mineGameRoutes.get('/my-bets',
  MineGameController.getMyBets,
  responseValidationMiddleware(mineGameSchema.getMyBetsSchema)
)

mineGameRoutes.get('/unfinished-bet-state',
  MineGameController.getUnfinishedGameState,
  responseValidationMiddleware(mineGameSchema.getUnfinishedGameStateSchema)
)

mineGameRoutes.post('/place-bet',
  requestValidationMiddleware(mineGameSchema.placeBetSchema),
  MineGameController.placeBet,
  responseValidationMiddleware(mineGameSchema.placeBetSchema)
)

mineGameRoutes.post('/cancel-bet',
  requestValidationMiddleware(mineGameSchema.cancelBetSchema),
  MineGameController.cancelBet,
  responseValidationMiddleware(mineGameSchema.cancelBetSchema)
)

mineGameRoutes.post('/open-tile',
  requestValidationMiddleware(mineGameSchema.openTileSchema),
  MineGameController.openTile,
  responseValidationMiddleware(mineGameSchema.openTileSchema)
)

mineGameRoutes.post('/cashout-bet',
  MineGameController.cashoutBet,
  responseValidationMiddleware(mineGameSchema.cashOutBetSchema)
)

mineGameRoutes.post('/place-auto-bet',
  requestValidationMiddleware(mineGameSchema.placeAutoBetSchema),
  MineGameController.placeAutoBet,
  responseValidationMiddleware(mineGameSchema.placeAutoBetSchema)
)

mineGameRoutes.post('/check-fairness',
  requestValidationMiddleware(mineGameSchema.checkFairnessSchema),
  MineGameController.checkProvableFair,
  responseValidationMiddleware(mineGameSchema.checkFairnessSchema)
)

export { mineGameRoutes }
