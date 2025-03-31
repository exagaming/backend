import { CACHE_KEYS } from '@src/utils/constants/app.constants'

/**
 * @param {import('express').Request} req
 */
export function getIp (req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress
}

export const gameSettingCacheKey = (operatorId) => `${CACHE_KEYS.GAME_SETTINGS}:OPERATOR_${operatorId}`

export const offensiveWordsCacheKey = (operatorId) => `${CACHE_KEYS.OFFENSIVE_WORDS}:OPERATOR_${operatorId}`

export const gameUserFinancialTokenCacheKey = (operatorId, userId) => `${CACHE_KEYS.OPERATOR_USER_TOKEN}:OPERATOR_${operatorId}:USER_${userId}`

export const getOperatorUserServerSeedCacheKey = (operatorId, userId) => `${CACHE_KEYS.SERVER_SEED}:OPERATOR_${operatorId}:USER_${userId}`

export const getRegistrationUsersCacheKey = (operatorId) => `${CACHE_KEYS.REGISTRATION_USERS}:OPERATOR_${operatorId}`

export const getGambleUsersCacheKey = (gameId, operatorId, userId) => `${CACHE_KEYS.GAMBLE_USERS}:OPERATOR_${operatorId}:USER_${userId}:GAME_${gameId}`
