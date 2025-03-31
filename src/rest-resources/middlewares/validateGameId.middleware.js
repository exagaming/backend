import { InvalidGameIdErrorType } from '@src/libs/errorTypes'

/**
 * @param {array<number> | number} gameIdList
 * @returns {import('express').Handler}
 */
export function validateGameIdsMiddleware (gameIds) {
  return async (req, _, next) => {
    if (Array.isArray(gameIds) && gameIds.includes(+req?.context?.auth?.gameId)) return next()
    else if (gameIds === +req?.context?.auth?.gameId) return next()

    next(InvalidGameIdErrorType)
  }
}
