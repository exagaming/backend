import { sequelize } from '@src/db'
import { sendResponse } from '@src/helpers/response.helpers'
import { CancelBetService } from '@src/services/game/crash/cancelBet.service'
import { CheckFairnessService } from '@src/services/game/crash/checkFairness.service'
import { GetMyBetsService } from '@src/services/game/crash/getMyBets.service'
import { GetRoundHistoryService } from '@src/services/game/crash/getRoundHistory.service'
import { GetTopBetsService } from '@src/services/game/crash/getTopBets.service'
import { PlaceBetService } from '@src/services/game/crash/placeBet.service'
import { PlayerEscapeService } from '@src/services/game/crash/playerEscape.service'

export class CrashController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getHistory (req, res, next) {
    try {
      const result = await GetRoundHistoryService.execute({ ...req.query, gameId: req.context.auth.gameId }, req.context)
      sendResponse({ req, res, next }, result)
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
      const result = await PlaceBetService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async cancelBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const result = await CancelBetService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async playerEscape (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const result = await PlayerEscapeService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async getMyBets (req, res, next) {
    try {
      const result = await GetMyBetsService.execute({ ...req.query, ...req.context.auth }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getTopBets (req, res, next) {
    try {
      const result = await GetTopBetsService.execute({ ...req.query, ...req.context.auth }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
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
      const result = await CheckFairnessService.execute({ ...req.body, gameId: req.context.auth.gameId }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
