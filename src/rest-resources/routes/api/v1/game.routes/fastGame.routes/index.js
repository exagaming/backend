import { validateGameIdsMiddleware } from '@src/rest-resources/middlewares/validateGameId.middleware'
import { DEFAULT_GAME_ID, MINE_GAME_IDS } from '@src/utils/constants/game.constants'
import express from 'express'
import { blackJackGameRoutes } from './blackJack.routes'
import { mineGameRoutes } from './mine.routes'
import { plinkoGameRoutes } from './plinko.routes'
import { rouletteGameRoutes } from './roulettte.routes'

const fastGameRouter = express.Router()

fastGameRouter.use('/mine', validateGameIdsMiddleware(MINE_GAME_IDS), mineGameRoutes)
fastGameRouter.use('/plinko', validateGameIdsMiddleware(DEFAULT_GAME_ID.PLINKO), plinkoGameRoutes)
fastGameRouter.use('/roulette', validateGameIdsMiddleware(DEFAULT_GAME_ID.ROULETTE), rouletteGameRoutes)
fastGameRouter.use('/blackjack', validateGameIdsMiddleware(DEFAULT_GAME_ID.BLACK_JACK), blackJackGameRoutes)

export { fastGameRouter }
