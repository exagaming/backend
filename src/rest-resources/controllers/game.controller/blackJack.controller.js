import { sequelize } from '@src/db'
import { sendResponse } from '@src/helpers/response.helpers'
import { CheckFairnessService } from '@src/services/game/fast/blackJack/checkFairness.service'
import { GetMyBetsService } from '@src/services/game/fast/blackJack/getMyBets.service'
import { GetUnfinishedBetService } from '@src/services/game/fast/blackJack/getUnfinishedBet.service'
import { HitService } from '@src/services/game/fast/blackJack/hit.service'
import { PlaceBetService } from '@src/services/game/fast/blackJack/placeBet.service'
import { PlaceDoubleBetService } from '@src/services/game/fast/blackJack/placeDoubleBet.service'
import { PlaceInsuranceBetService } from '@src/services/game/fast/blackJack/placeInsuranceBet.service'
import { PlaceSplitBetService } from '@src/services/game/fast/blackJack/placeSplitBet.service'
import { StandService } from '@src/services/game/fast/blackJack/stand.service'

export class BlackJackGameController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUnfinishedBet (req, res, next) {
    try {
      const { result, successful, errors } = await GetUnfinishedBetService.execute(req.context.auth, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
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
      const { result, successful, errors } = await GetMyBetsService.execute({ ...req.query, ...req.context.auth }, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
  static async placeDoubleBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await PlaceDoubleBetService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
  static async placeSplitBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await PlaceSplitBetService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
  static async placeInsuranceBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await PlaceInsuranceBetService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
  static async hit (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await HitService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
  static async stand (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await StandService.execute({ ...req.body, ...req.context.auth }, req.context)
      await req.context.sequelizeTransaction.commit()
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
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
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
