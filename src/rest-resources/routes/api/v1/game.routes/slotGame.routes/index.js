import { CommonController } from '@src/rest-resources/controllers/game.controller/slot.controller/common.controller'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { validateGameIdsMiddleware } from '@src/rest-resources/middlewares/validateGameId.middleware'
import { SLOT_ENGINE_GAME_IDS } from '@src/utils/constants/game.constants'
import express from 'express'
import { engineElevenRoutes } from './engineEleven.routes'
import { engineFiveRoutes } from './engineFive.routes'
import {  engineTherteenRoutes } from './engineThirteen.routes'
import { engineOneRoutes } from './engineOne.routes'

import { engineSixRoutes } from './engineSix.routes'
import { engineTwelveRoutes } from './engineTwelve.routes'
import { engineTwoRoutes } from './engineTwo.routes'
import { engineThreeRoutes } from './engineThree.routes'
import { engineNineRoutes } from './engineNine.routes'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import { v1Schema } from '@src/schema'
import { engineFourRoutes } from './engineFour.routes'

const slotGameRouter = express.Router()
const slotGameSchema = v1Schema.gameSchema.slotSchema.slotGameSchema

slotGameRouter.use('/engine-two', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_2), engineTwoRoutes)
slotGameRouter.use('/engine-three', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_3), engineThreeRoutes)
slotGameRouter.use('/engine-one', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_1), engineOneRoutes)
slotGameRouter.use('/engine-thertine', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_13), engineTherteenRoutes)
slotGameRouter.use('/engine-eleven', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_11), engineElevenRoutes)
slotGameRouter.use('/engine-twelve', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_12), engineTwelveRoutes)
slotGameRouter.use('/engine-five', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_5), engineFiveRoutes)
slotGameRouter.use('/engine-six', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_6), engineSixRoutes)
slotGameRouter.use('/engine-four', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_4), engineFourRoutes)
slotGameRouter.use('/engine-nine', validateGameIdsMiddleware(SLOT_ENGINE_GAME_IDS.ENGINE_9), engineNineRoutes)

slotGameRouter.post('/keep-alive',
  CommonController.keepAlive,
  responseValidationMiddleware({})
)
slotGameRouter.get('/my-bets',
  requestValidationMiddleware(slotGameSchema.getSlotMyBetsSchema),
  CommonController.slotMyBets,
  responseValidationMiddleware(slotGameSchema.getSlotMyBetsSchema)
)

export { slotGameRouter }
