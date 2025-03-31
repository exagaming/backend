import { models, operatorModels } from '@src/db'
import { secondsToMidnight } from '@src/helpers/dayjs.helper'
import { Cache } from '@src/libs/cache'
import { Logger } from '@src/libs/logger'
import { gameSettingCacheKey, getRegistrationUsersCacheKey, offensiveWordsCacheKey } from '@src/utils/common.utils'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

/**
 * @param {string} operatorId
 * @returns {void}
 */
export async function setRegisteredUserCount (operatorId) {
  const cacheKey = getRegistrationUsersCacheKey(operatorId)
  const registeredUsers = await Cache.get(cacheKey)
  await Cache.setWithTTL(cacheKey, registeredUsers ? registeredUsers + 1 : 1, secondsToMidnight() * 1000)
}

async function populateChatLanguagesCache () {
  const chatLanguages = await models.ChatLanguage.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, logging: false })
  await Cache.set(CACHE_KEYS.CHAT_LANGUAGES, chatLanguages)
  Logger.info('CacheHelper', { message: 'Chat languages cache populated...' })
}

async function populateGamesCache () {
  const games = await models.Game.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, logging: false })
  await Cache.set(CACHE_KEYS.GAMES, games)
  Logger.info('CacheHelper', { message: 'Games cache populated...' })
}

async function populateCurrenciesCache () {
  const currencies = await models.Currency.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, logging: false })
  await Cache.set(CACHE_KEYS.CURRENCIES, currencies)
  Logger.info('CacheHelper', { message: 'Currencies cache populated...' })
}

async function populateOperatorOffensiveWordsCache (operatorId) {
  const offensiveWords = await operatorModels[operatorId].OffensiveWord.findAll({ attributes: ['id', 'word'], raw: true, logging: false })
  await Cache.set(offensiveWordsCacheKey(operatorId), offensiveWords)
  Logger.info('CacheHelper', { message: `Operator ${operatorId} offensive words cache populated...` })
}

async function populateOperatorGameSettings (operatorId) {
  const gameSettings = await operatorModels[operatorId].GameSetting.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    include: {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      model: models.Game,
      as: 'game'
    },
    raw: true,
    nest: true,
    logging: false
  })
  await Cache.set(gameSettingCacheKey(operatorId), gameSettings)
  Logger.info('CacheHelper', { message: `Operator ${operatorId} game settings cache populated...` })
}

async function populateOperatorSpecificCache () {
  const operators = await models.Operator.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] }, raw: true, logging: false })
  await Promise.all(operators.map(async operator => {
    await populateOperatorGameSettings(operator.id)
    await populateOperatorOffensiveWordsCache(operator.id)
  }))
  await Cache.set(CACHE_KEYS.OPERATORS, operators)
  Logger.info('CacheHelper', { message: 'Operators cache populated...' })
}

export async function populateCache () {
  await populateGamesCache()
  await populateCurrenciesCache()
  await populateChatLanguagesCache()
  await populateOperatorSpecificCache()
}
