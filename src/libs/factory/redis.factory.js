import { Logger } from '@src/libs/logger'
import Redis from 'ioredis'

/**
 * @typedef {object} RedisConnections
 * @property {Redis} client
 * @property {Redis} publisherClient
 * @property {Redis} subscriberClient
 * @property {string} name
 */

/** @type {[RedisConnections]} */
const redisMeta = []

/**
 * @param {Redis} client
 * @param {Redis} subscriberClient
 * @param {Function} callback
 */
function subscribeKeyEventExpired (client, subscriberClient, callback) {
  client.call('config', 'set', 'notify-keyspace-events', 'Ex')

  subscriberClient.subscribe('__keyevent@0__:expired')
  subscriberClient.on('message', callback)
  subscriberClient.on('close', () => {
    subscriberClient.off('message', callback)
  })
}

/**
 * @param {import('ioredis').RedisOptions} connection
 * @return {RedisConnections}
 */
function create (name = 'redis', connection, includePubSub = false) {
  const redisConnections = {
    name,
    client: new Redis({ ...connection }),
    publisherClient: null,
    subscriberClient: null
  }

  redisConnections.client.on('connect', () => {
    Logger.info('RedisFactory', { message: `${redisConnections.name} connected...` })
  })

  redisConnections.client.on('close', () => {
    Logger.error('RedisFactory', { message: `${redisConnections.name} closed...` })
  })

  redisConnections.client.on('end', () => {
    Logger.error('RedisFactory', { message: `${redisConnections.name} End...` })
  })

  if (includePubSub) {
    redisConnections.publisherClient = redisConnections.client.duplicate()
    redisConnections.subscriberClient = redisConnections.client.duplicate()
  }

  redisMeta.push(redisConnections)
  return redisConnections
}

/**
 * Function to close a redis instance
 * @param {string} name
 */
function close (name) {
  const redis = redisMeta.find(redis => redis.name === name)
  redis.client.disconnect()
  Logger.error('RedisFactory', { message: `${redis.name} closed...` })
}

/**
 * Function to close all redis instances at once
 */
function closeAll () {
  redisMeta.forEach(redis => {
    redis.client.disconnect()
    Logger.error('RedisFactory', { message: `${redis.name} closed...` })
  })
}

/**
 * Function to close all redis instances at once
 */
async function checkAll () {
  await Promise.all(redisMeta.map(async redis => {
    const pong = await redis.client.ping()
    if (pong !== 'PONG') {
      Logger.error('RedisFactory', { message: `Unhealthy ${redis.name} redis instance` })
      throw Error(redis.name)
    }
  }))
}

export const redisFactory = {
  close,
  create,
  checkAll,
  closeAll,
  subscribeKeyEventExpired,
  redisConnections: redisMeta
}
