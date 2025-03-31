import config from '@src/configs/app.config'
import { operatorModels } from '@src/db'
import { AuthenticationError } from '@src/errors/authentication.error'
import { messages } from '@src/utils/constants/error.constants'
import jwt from 'jsonwebtoken'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function authenticationMiddleWare (req, res, next) {
  try {
    const jwtToken = req.headers.authorization?.split(' ')[1]
    if (!jwtToken) next(new AuthenticationError(messages.MISSING_TOKEN))

    req.context.auth = jwt.verify(jwtToken, config.get('jwt.loginTokenSecret'))
    req.context.dbModels = operatorModels[req.context.auth.operatorId]

    next()
  } catch (error) {
    next(new AuthenticationError(error))
  }
}
