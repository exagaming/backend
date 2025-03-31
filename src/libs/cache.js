import config from '@src/configs/app.config'
import { redisFactory } from '@src/libs/factory/redis.factory'

const cacheClient = redisFactory.create('cache-client', {
  host: config.get('redis_db.host'),
  port: config.get('redis_db.port'),
  password: config.get('redis_db.password')
}).client

export class Cache {
  static #cachePrefix = 'BACKEND_CACHE'
  static #getKey = (key) => `${this.#cachePrefix}:${key}`

  /**
   * @param {string} key
   * @param {string} value
   * @param {number} ttl
   * @returns
   */
  static async setWithTTL (key, value, ttl) {
    return cacheClient.set(this.#getKey(key), JSON.stringify(value), 'EX', parseInt(ttl / 1000))
  }

  /**
   * @param {string} key
   * @param {string} value
   * @returns
   */
  static async set (key, value) {
    return cacheClient.set(this.#getKey(key), JSON.stringify(value))
  }

  /**
   * @param {string} key
   * @returns
   */
  static async get (key) {
    const data = await cacheClient.get(this.#getKey(key))
    return JSON.parse(data)
  }

  /**
   * @param {string} key
   * @returns
   */
  static async getTTL (key) {
    const data = await cacheClient.ttl(this.#getKey(key))
    return data
  }

  /**
   * @param {string} key
   * @returns
   */
  static del (key) {
    return cacheClient.del(this.#getKey(key))
  }

  /**
   * @returns {Array}
   */
  static async keys () {
    const keys = await cacheClient.keys(`${this.#cachePrefix}:*`)
    return keys
  }
}
