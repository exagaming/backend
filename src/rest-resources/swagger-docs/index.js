import config from '@src/configs/app.config'

const swaggerDocs = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'ExaGamings API Doc',
    description: 'Endpoints'
  },
  host: config.get('swagger.base_url'),
  basePath: '/api/v1',
  schemes: [
    'http',
    'https'
  ],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'Enter your bearer token in the format **Bearer &nbsp;token**'
    }
  },
  consumes: [
    'application/json'
  ],
  produces: [
    'application/json'
  ],
  paths: {
    ...require('./users-routes.swagger.json'),
    ...require('./slot-routes.swagger.json')
  },
  definitions: {
    ...require('./definitions.swagger.json')
  }
}

export default swaggerDocs
