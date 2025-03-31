import { Logger } from '@src/libs/logger'
import _ from 'lodash'

/**
 * @classdesc Service Base for creating services for business logic and logging
 * @hideconstructor
 */
class ServiceBase {
  #_args = {}
  #_context = {}
  #_errors = {}
  #_successful = true
  #_failed = false
  #_result = null

  constructor () {
    this.#_args = arguments[0]
    this.#_context = arguments[1]
    this.#validateServiceInputs()
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {App.Context}
   */
  get context () {
    return this.#_context
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {Object}
   */
  get args () {
    return this.#_args
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {Object || Array}
   */
  get result () {
    return this.#_result
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {Object}
   */
  get errors () {
    return this.#_errors
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {Boolean}
   */
  get failed () {
    return this.#_failed
  }

  /**
   * @readonly
   * @memberof ServiceBase
   * @returns {Boolean}
   */
  get successful () {
    return this.#_successful
  }

  /**
   *
   * @private
   * @function
   * @async
   */
  async #tryExecuting () {
    if (_.size(this.errors)) {
      this.#_failed = true
      this.#_successful = false
      return
    }

    try {
      this.#_result = await this.run()
    } catch (error) {
      this.#_failed = true
      this.#_successful = false
      Logger.error('Exception raised in Service', { klass: this.constructor, message: error.message, context: this.args, exception: error, userCtx: this.context })
      throw error
    }
  }

  /**
   * @async
   * @readonly
   * @memberof ServiceBase
   * @returns {void}
   */
  async #validateServiceInputs () {
    const schema = this.constraints
    if (!schema) return

    const valid = schema(this.#_args)
    if (!valid) {
      this.#_errors = schema.errors.map(error => `${this.constructor.name} | ${error.message}`)
      Logger.error('Service input Validation Failed', { klass: this.constructor, message: 'Validation Failed', context: this.args, userCtx: this.context, fault: this.errors })
    }
  }

  // Static methods
  /**
   * @async
   * @static
   * @readonly
   * @memberof ServiceBase
   * @returns
   */
  static async run () {
    Logger.debug(`Service Started: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'start' })
    const args = arguments
    const instance = new this(...args)
    await instance.#tryExecuting()
    if (_.size(instance.errors)) throw instance.errors
    Logger.debug(`Service Finished: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'end' })
    return instance.result
  }

  /**
   * @async
   * @static
   * @readonly
   * @memberof ServiceBase
   * @returns
   */
  static async execute () {
    Logger.debug(`Service Started: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'start' })
    const args = arguments
    const instance = new this(...args)
    await instance.#tryExecuting()
    Logger.debug(`Service Finished: ${this.name}`, { context: this.args, userCtx: this.context, wrap: 'end' })
    return instance
  }
}

export default ServiceBase
