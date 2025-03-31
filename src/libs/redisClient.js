import config from '@src/configs/app.config'
import { redisFactory } from '@src/libs/factory/redis.factory'

const redis = redisFactory.create('redis-client', {
  host: config.get('redis_db.host'),
  port: config.get('redis_db.port'),
  password: config.get('redis_db.password')
}, true)

export default {
  client: redis.client,
  publisherClient: redis.publisherClient,
  subscriberClient: redis.subscriberClient
}
