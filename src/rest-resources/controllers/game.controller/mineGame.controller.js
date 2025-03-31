import { sequelize } from '@src/db'
import { sendResponse } from '@src/helpers/response.helpers'
import { CancelBetService } from '@src/services/game/fast/mine/cancelBet.service'
import { CashoutBetService } from '@src/services/game/fast/mine/cashoutBet.service'
import { CheckFairnessService } from '@src/services/game/fast/mine/checkFairness.service'
import { GetMyBetsService } from '@src/services/game/fast/mine/getMyBets.service'
import { GetUnfinishedGameStateService } from '@src/services/game/fast/mine/getUnfinishedGameState.service'
import { OpenTileService } from '@src/services/game/fast/mine/openTile.service'
import { PlaceAutoBetService } from '@src/services/game/fast/mine/placeAutoBet.service'
import { PlaceBetService } from '@src/services/game/fast/mine/placeBet.service'

export class MineGameController {
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
  static async getUnfinishedGameState (req, res, next) {
    try {
      const { result, successful, errors } = await GetUnfinishedGameStateService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async cancelBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await CancelBetService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async openTile (req, res, next) {
    console.log("OPEN TILE",  req.context.auth.gameId)
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await OpenTileService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async cashoutBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await CashoutBetService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async placeAutoBet (req, res, next) {
    req.context.sequelizeTransaction = await sequelize.transaction()
    try {
      const { result, successful, errors } = await PlaceAutoBetService.execute({ ...req.body, ...req.context.auth }, req.context)
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
  static async checkProvableFair (req, res, next) {
    try {
      const { result, successful, errors } = await CheckFairnessService.execute(req.body, req.context)
      sendResponse({ req, res, next }, { result, successful, serviceErrors: errors })
    } catch (error) {
      next(error)
    }
  }
}
