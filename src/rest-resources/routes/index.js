import { onHealthCheck } from '@src/libs/onHealthCheck'
import express from 'express'
import { apiRouter } from './api'

const router = express.Router()

router.use('/api', apiRouter)
router.get('/health-check', onHealthCheck)

export { router }
