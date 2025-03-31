import { createHMACSignature, verifyHMACSignature } from '@src/helpers/encryption.helpers'
import ajv from '@src/libs/ajv'
import { Logger } from '@src/libs/logger'
import { operatorCallbackResponse } from '@src/schema'
import { messages } from '@src/utils/constants/error.constants'
import { OPERATOR_RESPONSE_CODES, operatorErrorMessage } from '@src/utils/constants/operator.constants'
import { Axios } from 'axios'
import { divide, minus } from 'number-precision'

const compiledSchemas = {
  authenticateResponseSchema: ajv.compile(operatorCallbackResponse.authenticateResponseSchema.responseSchema)
}

/**
 * @typedef User
 * @property {string} id
 * @property {string} token
 *
 * @typedef Authenticate
 * @property {string} token
 *
 * @typedef Credit
 * @property {string} roundId
 * @property {string} gameId
 * @property {string} gameName
 * @property {string} amount
 * @property {string} transactionId
 * @property {string} debitTransactionId
 * @property {string} betId
 * @property {string} currencyId
 * @property {string} currencyCode
 * @property {User} user
 *
 * @typedef Debit
 * @property {string} roundId
 * @property {string} gameId
 * @property {string} gameName
 * @property {string} amount
 * @property {string} transactionId
 * @property {string} betId
 * @property {string} currencyId
 * @property {string} currencyCode
 * @property {User} user
 *
 * @typedef Fund
 * @property {string} token
 * @property {string} currencyCode
 *
 * @typedef GameClose
 * @property {User} user
 *
 * @typedef Rollback
 * @property {string} roundId
 * @property {string} gameId
 * @property {string} gameName
 * @property {string} amount
 * @property {string} originalTransactionId
 * @property {string} rollbackTransactionId
 * @property {string} betId
 * @property {string} currencyId
 * @property {string} currencyCode
 * @property {User} user
 *
 */

export class OperatorAxios extends Axios {
  /**
   * @param {string} baseURL
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   */
  constructor (baseURL, operatorId, operatorSecretKey) {
    super({
      baseURL,
      timeout: 5000,
      transitional: {
        clarifyTimeoutError: false
      },
      headers: {
        'x-operator-id': operatorId,
        'Content-Type': 'application/json'
      }
    })

    this.interceptors.request.use(this.#requestTransformer(operatorSecretKey), this.#interceptorErrorHandler)
    this.interceptors.response.use(this.#responseTransformer(operatorSecretKey), this.#interceptorErrorHandler)
  }

  /**
   * @param {string} operatorSecretKey
   * @returns {import('axios').AxiosRequestTransformer}
   */
  #requestTransformer (operatorSecretKey) {
    return (config) => {
      config.data = JSON.stringify(config.data)
      config.headers['x-request-timestamp'] = Date.now()
      config.headers['x-operator-signature'] = createHMACSignature(config.data, operatorSecretKey)

      Logger.info('OperatorAxios', { message: `Operator ${config.headers['x-operator-id']} ${config.url.replace('/', '')} request`, context: JSON.stringify({ data: config.data, headers: config.headers }) })
      return config
    }
  }

  /**
   * @param {string} operatorSecretKey
   * @returns {import('axios').AxiosResponseTransformer}
   */
  #responseTransformer (operatorSecretKey) {
    return (response) => {
      const responseTime = divide(minus(Date.now(), response.config.headers['x-request-timestamp']), 1000)
      Logger.info('OperatorAxios', { message: `Operator ${response.config.headers['x-operator-id']} ${response.config.url.replace('/', '')} response`, context: JSON.stringify({ data: response.data, status: response.status, responseTime: responseTime + 's' }) })

      if (response.status !== 200 && response.status !== 201) throw messages.OPERATOR_UNAVAILABLE
      response.data = JSON.parse(response.data)

      const responseStatus = response.data.status
      console.log("responseStatus", response)
      if (responseStatus !== OPERATOR_RESPONSE_CODES.SUCCESS) throw operatorErrorMessage[responseStatus] || messages.UNKNOWN_OPERATOR_ERROR

      // TODO: Not validating response for now, will fix this in next version
      const isValid = verifyHMACSignature(response.data, response.headers['x-operator-signature'], operatorSecretKey)
      if (isValid) throw messages.SIGNATURE_NOT_VERIFIED

      return response
    }
  }

  #interceptorErrorHandler (error) {
    return {
      data: {
        status: OPERATOR_RESPONSE_CODES.NETWORK_FAILURE,
        message: String(`${error.code}: ${error.message}`)
      }
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {Authenticate} data
   * @returns {Object}
   */
  static async authenticate (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/authenticate', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return this.validateResponse(compiledSchemas.authenticateResponseSchema, response.data)
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} authentication error`, fault: error })
      throw error
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {Credit} data
   * @returns {Object}
   */
  static async win (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/win', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return response.data
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} win error`, fault: error })
      throw error
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {Debit} data
   * @returns {Object}
   */
  static async bet (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/bet', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return response.data
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} bet error`, fault: error })
      throw error
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {Fund} data
   * @returns {Object}
   */
  static async funds (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/funds', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return response.data
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} funds error`, fault: error })
      throw error
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {GameClose} data
   * @returns {Object}
   */
  static async gameClose (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/game-close', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return response.data
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} game close error`, fault: error })
      throw error
    }
  }

  /**
   * @param {string} operatorId
   * @param {string} operatorSecretKey
   * @param {Rollback} data
   * @returns {Object}
   */
  static async rollback (baseURL, operatorId, operatorSecretKey, data) {
    try {
      const operatorAxios = new OperatorAxios(baseURL, operatorId, operatorSecretKey)
      const response = await operatorAxios.post('/rollback', data)

      if (!response) throw messages.OPERATOR_UNREACHABLE

      return response.data
    } catch (error) {
      Logger.error('OperatorAxios', { message: `Operator ${operatorId} rollback error`, fault: error })
      throw error
    }
  }

  static validateResponse (compiledSchema, data) {
    compiledSchema(data)
    if (!compiledSchema) {
      const errors = ajv.errorsText(compiledSchema.errors, { separator: ' ||||| ' }).split(' ||||| ')
      Logger.error('OperatorAxios', { message: 'Invalid response from operator', fault: errors })
    }

    return data
  }
}
