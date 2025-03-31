import config from '@src/configs/app.config'
import { Cache } from '@src/libs/cache'
import { gameUserFinancialTokenCacheKey } from '@src/utils/common.utils'
import jwt from 'jsonwebtoken'
import { InvalidTokenErrorType } from '../../libs/errorTypes'
import { Logger } from '../../libs/logger'

export default async function authenticationSocketNamespaceMiddleWare (socket, next) {
  try {
    const { auth, headers } = socket.handshake

    const jwtToken = auth.authorization?.split(' ')[1] || headers.authorization?.split(' ')[1] // api testing

    if (!jwtToken) {
      next(InvalidTokenErrorType)
    }

    let jwtDecoded = {}

    jwtDecoded = jwt.verify(jwtToken, config.get('jwt.loginTokenSecret'))

    socket.auth = jwtDecoded || {}

    const cachedToken = await Cache.get(gameUserFinancialTokenCacheKey(jwtDecoded.operatorId, jwtDecoded.userId))

    if (!cachedToken) {
      next(InvalidTokenErrorType)
    }

    next()
  } catch (err) {
    Logger.error('Error in authenticationSocketMiddleware', {
      message: err.message,
      context: socket.handshake,
      exception: err
    })

    next(InvalidTokenErrorType)
  }
}
