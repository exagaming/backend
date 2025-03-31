import { sendResponse } from '@src/helpers/response.helpers'
import { GetBetsService } from '@src/services/game/slot/getBets.service'
import { KeepAliveService } from '@src/services/game/slot/keepALive.service'

export class CommonController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async keepAlive (req, res, next) {
    try {
      const result = await KeepAliveService.execute({ ...req.context.auth }, req.context)
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
  static async slotMyBets (req, res, next) {
    try {
      const result = await GetBetsService.execute({ ...req.query, ...req.context.auth }, req.context)
      sendResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
