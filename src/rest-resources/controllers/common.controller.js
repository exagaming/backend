import { sendResponse } from '@src/helpers/response.helpers'
import { GetCurrenciesService } from '@src/services/common/getCurrencies.service'
import { GetGamesService } from '@src/services/common/getGames.service'
import { GetGameSettingsService } from '@src/services/common/getGameSettings.service'
import { TempRetryBetServices } from '@src/services/common/tempRetryBet.service'

export class CommonController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getGameSettings (req, res, next) {
    try {
      const result = await GetGameSettingsService.execute({ operatorId: req.context.auth.operatorId }, req.context)
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
  static async getCurrencies (req, res, next) {
    try {
      const result = await GetCurrenciesService.execute({}, req.context)
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
  static async getGames (req, res, next) {
    try {
      const result = await GetGamesService.execute({}, req.context)
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
  static async tempRetryBet (req, res, next) {
    try {
      const result = await TempRetryBetServices.execute(req.body, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
