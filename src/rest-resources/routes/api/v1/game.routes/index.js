import { validateGameIdsMiddleware } from '@src/rest-resources/middlewares/validateGameId.middleware'
import { CRASH_GAME_IDS } from '@src/utils/constants/game.constants'
import express from 'express'
import { crashGameRoutes } from './crashGame.routes'
import { fastGameRouter } from './fastGame.routes'
import { slotGameRouter } from './slotGame.routes'

const gameRouter = express.Router()

gameRouter.use('/slot', slotGameRouter)
gameRouter.use('/fast', fastGameRouter)
gameRouter.use('/crash', crashGameRoutes, validateGameIdsMiddleware(CRASH_GAME_IDS))

export { gameRouter }
