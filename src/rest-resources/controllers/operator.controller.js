import { sendResponse } from '@src/helpers/response.helpers'
import { GetGameListService } from '@src/services/operator/gameList.service'

export class OperatorController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async gameList (req, res, next) {
    try {
      const result = await GetGameListService.execute(req.params, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
