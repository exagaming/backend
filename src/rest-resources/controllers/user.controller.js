import { getServerSeed } from '@src/helpers/encryption.helpers'
import { sendResponse } from '@src/helpers/response.helpers'
import { GameCloseService } from '@src/services/user/gameClose.service'
import { GetUserDetailService } from '@src/services/user/getUserDetail.service'
import { LoginService } from '@src/services/user/login.service'
import { UpdateProfileService } from '@src/services/user/updateProfile.service'
import { getIp } from '@src/utils/common.utils'

export class UserController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUserDetail (req, res, next) {
    try {
      const result = await GetUserDetailService.execute({ userId: req.context.auth.userId }, req.context)
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
  static async login (req, res, next) {
    try {
      const result = await LoginService.execute({ ...req.body, signInIp: getIp(req) }, req.context)
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
  static async updateProfile (req, res, next) {
    try {
      const result = await UpdateProfileService.execute({ ...req.body, userId: req.context.auth.userId }, req.context)
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
  static async gameClose (req, res, next) {
    try {
      const result = await GameCloseService.execute(req.context.auth, req.context)
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
  static async generateServerSeed (req, res, next) {
    try {
      const { nextServerSeedHash: serverSeedHash } = getServerSeed(req.context.auth.userId, req.context.auth.operatorId)
      sendResponse({ req, res, next }, { successful: true, result: { serverSeedHash }, errors: [] })
    } catch (error) {
      next(error)
    }
  }
}
