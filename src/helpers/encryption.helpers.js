import config from '@src/configs/app.config'
import { Cache } from '@src/libs/cache'
import { gameUserFinancialTokenCacheKey, getOperatorUserServerSeedCacheKey } from '@src/utils/common.utils'
import crypto from 'crypto'

/**
 * @param {string} message
 * @param {string} secretKey
 * @returns {string}
 */
export function createHMACSignature (message, secretKey) {
  const computedSignature = crypto.createHmac('sha256', secretKey).update(message).digest('hex')
  return computedSignature
}

/**
 * @param {object} data
 * @param {string} signature
 * @param {string} secretKey
 * @returns {boolean}
 */
export function verifyHMACSignature (data, signature, secretKey) {
  const message = JSON.stringify(data)
  const computedSignature = crypto.createHmac('sha256', secretKey).update(message).digest('hex')
  return signature === computedSignature
}

/**
 * @returns {string} Seed hash
 */
export function generateSeedHash () {
  const seed = crypto.randomBytes(16).toString('hex')
  const seedHash = crypto.createHash('sha256').update(seed).digest('hex')

  return { seed, seedHash }
}

/**
 * @param {string} userId
 * @param {string} operatorId
 * @returns {{
 *  serverSeed: string
 *  nextServerSeedHash: string
 * }}
 */
export async function getServerSeed (userId, operatorId) {
  const serverSeedKey = getOperatorUserServerSeedCacheKey(operatorId, userId)

  const serverSeed = await Cache.get(serverSeedKey)
  const expiryTime = await Cache.getTTL(gameUserFinancialTokenCacheKey(operatorId, userId))

  const { seed, seedHash: nextServerSeedHash } = generateSeedHash()
  await Cache.setWithTTL(serverSeedKey, seed, expiryTime > 0 ? expiryTime * 1000 : config.get('jwt.loginTokenExpiry'))

  return { serverSeed, nextServerSeedHash }
}

/**
 * @param {string} serverSeed
 * @param {string} clientSeed
 * @param {number?} upperLimit
 * @returns {number}
 */
export function generateRandomNumber (seed, salt, upperLimit = 1, lowerLimit = 0) {
  const nBits = 32 // number of most significant bits to use

  const hmac = crypto.createHmac('sha256', seed).update(salt)
  const updatedSeed = hmac.digest('hex').slice(0, nBits / 4) // For more variability we are using 16 bits

  const probability = parseInt(updatedSeed, 16) / Math.pow(2, nBits) // uniformly distributed in [0, 1]
  const randomNumber = probability * (upperLimit - lowerLimit) + lowerLimit // Number will be generated in [0, maxNumber]

  return randomNumber
}
