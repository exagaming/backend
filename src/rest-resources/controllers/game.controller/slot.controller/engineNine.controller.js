import { sequelize } from '@src/db'
import { sendResponse } from '@src/helpers/response.helpers'
import { PreloadService } from '@src/services/game/slot/engine9/preload.service'
import { TransactService } from '@src/services/game/slot/engine9/transact.service'

export class EngineNineController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async transact (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const result = await TransactService.execute(req.body, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, result)
    } catch (error) {
      await req.context.sequelizeTransaction.rollback()
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async preload (req, res, next) {
    try {
      const result = await PreloadService.execute(req.context.auth, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
