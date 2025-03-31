import { models, operatorModels, sequelize } from '@src/db'
import { initOperatorDatabase } from '@src/helpers/database.helper'
import i18n from '@src/libs/i18n'
import { Logger } from '@src/libs/logger'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { v4 as uuid } from 'uuid'

/**
 * Creates a context for keeping request track if included in a request
 * Attach context object in request object, context object will hold following properties
 * traceId - id of the request
 * sequelize - sequelize database connection
 * dbModels - all sequelize models
 * logger - logger instance
 * socketEmitter - socket emitter for emitting data directly
 *
 * NOTE: If you want to update request.context interface please see file custom.d.ts
 *
 * @type {import('express').Handler}
 */
export async function contextMiddleware (req, _, next) {
  req.context = {}
  req.authenticated = false

  req.context.locale = req?.headers?.locale || i18n.getLocale().toUpperCase()
  req.context.logger = Logger
  req.context.traceId = uuid()
  req.context.sequelize = sequelize
  req.context.reqTimeStamp = Date.now()
  req.context.dbModels = models

  try {
    const operatorId = req.body.operatorId || req.query.operatorId || req.params.operatorId
    if (operatorId) {
      if (!operatorModels[operatorId]) {
        const operator = await OperatorDetailsService.run({ operatorId }, this.context)
        operatorModels[operatorId] = initOperatorDatabase(operator.name, sequelize)
      }
      req.context.dbModels = operatorModels[operatorId]
    }
    next()
  } catch (error) {
    next(error)
  }
}
