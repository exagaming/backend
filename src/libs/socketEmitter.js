import { Emitter } from '@socket.io/redis-emitter'
import redisClient from '@src/libs/redisClient'

const socketEmitter = new Emitter(redisClient.publisherClient)

export default socketEmitter
