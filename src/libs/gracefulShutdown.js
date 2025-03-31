import { sequelize } from '@src/db'
import { redisFactory } from '@src/libs/factory/redis.factory'
import { Logger } from '@src/libs/logger'

let signalReceived = false
export default async function gracefulShutdown (signal) {
  if (signalReceived) return
  signalReceived = true

  try {
    await redisFactory.closeAll()
    await sequelize.close()
    process.exit(0)
  } catch (error) {
    Logger.error('GracefulShutdown', { message: 'Error shutting down, shutting down manually...' })
    process.exit(1)
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGUSR2', gracefulShutdown)
