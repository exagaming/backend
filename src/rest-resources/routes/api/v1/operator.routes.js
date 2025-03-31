import { OperatorController } from '@src/rest-resources/controllers/operator.controller'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const operatorRoutes = express.Router()
const operatorSchema = v1Schema.operatorSchema

operatorRoutes.route('/:operatorId/game-list').get(
  OperatorController.gameList,
  responseValidationMiddleware(operatorSchema.gameListSchema)
)

export { operatorRoutes }
