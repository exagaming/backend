import { CommonController } from '@src/rest-resources/controllers/common.controller'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const commonRoutes = express.Router()
const commonSchema = v1Schema.commonSchema

commonRoutes.get('/all-currencies',
  CommonController.getCurrencies,
  responseValidationMiddleware(commonSchema.getCurrenciesSchema)
)

commonRoutes.get('/game-details',
  CommonController.getGames,
  responseValidationMiddleware(commonSchema.getGamesSchema)
)

commonRoutes.get('/game-settings',
  CommonController.getGameSettings,
  responseValidationMiddleware(commonSchema.getGameSettingsSchema)
)

export { commonRoutes }
