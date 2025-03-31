import { sequelize } from '@src/db'
import { redisFactory } from '@src/libs/factory/redis.factory'
import { Logger } from '@src/libs/logger'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns
 */
export async function onHealthCheck (req, res) {
  let healthy = false

  try {
    await sequelize.authenticate()
    healthy = true
    Logger.info('HealthCheck', { message: 'Database healthy...' })
  } catch (error) {
    Logger.error('HealthCheck', { message: 'Database unhealthy...', exception: error })
  }

  try {
    await redisFactory.checkAll()
    healthy = true
    Logger.info('HealthCheck', { message: 'Redis Connections healthy...' })
  } catch (error) {
    Logger.error('HealthCheck', { message: 'Redis Connection unhealthy...', exception: error })
  }

  if (healthy) {
    res.json({
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    })
  } else {
    res.status(503)
    res.send()
  }
}
