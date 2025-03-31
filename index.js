import config from '@src/configs/app.config'
import { setupOperatorModels } from '@src/db'
import { addModelsSchemaToAjv } from '@src/helpers/ajv.helpers'
import { populateCache } from '@src/helpers/cache.helpers'
import '@src/libs/gracefulShutdown'
import i18n from '@src/libs/i18n'
import { Logger } from '@src/libs/logger'
import { contextMiddleware } from '@src/rest-resources/middlewares/context.middleware'
import { errorHandlerMiddleware } from '@src/rest-resources/middlewares/errorHandler.middleware'
import swaggerDocs from '@src/rest-resources/swagger-docs'
import socketServer from '@src/socket-resources'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'

(async () => {
  await setupOperatorModels()

  addModelsSchemaToAjv()

  await populateCache()

  const { router } = require('@src/rest-resources/routes')

  const app = express()

  app.use(i18n.init)

  app.use(helmet())

  app.use(bodyParser.json())

  app.use(morgan('tiny'))

  app.use(cors({
    credentials: true,
    origin: '*',
    methods: ['GET, POST, PUT, PATCH, DELETE']
  }))

  app.use(contextMiddleware)

  app.use(router)

  app.use('/docs',
    (req, res, next) => {
      res.setHeader('Content-Security-Policy', 'script-src \'self\'')
      next()
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, {
      swaggerOptions: {
        docExpansions: 'none',
        persistAuthorization: true
      }
    }))

  app.use(async (req, res) => {
    res.status(404).json({ status: 'Not Found' })
  })

  app.use(errorHandlerMiddleware)

  const httpServer = createServer(app)

  socketServer.attach(httpServer)

  httpServer.listen({ port: config.get('port') }, () => {
    Logger.info('Server', { message: `Listening On ${config.get('port')}` })
  })
})()
