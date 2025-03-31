import { sequelize } from '@src/db'
import { sendResponse } from '@src/helpers/response.helpers'
import { CheckFairnessService } from '@src/services/game/fast/roulette/checkFairness.service'
import { GetMyBetsService } from '@src/services/game/fast/roulette/getMyBets.service'
import { PlaceBetService } from '@src/services/game/fast/roulette/placeBet.service'

export class RouletteGameController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getMyBets (req, res, next) {
    try {
      const { result, successful, errors } = await GetMyBetsService.execute({ ...req.query, ...req.context.auth }, req.context)
      sendResponse({ req, res, next }, { result, successful, errors })
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async placeBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await PlaceBetService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, errors })
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
  static async checkFairness (req, res, next) {
    try {
      const { result, successful, errors } = await CheckFairnessService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, errors })
    } catch (error) {
      next(error)
    }
  }
}
