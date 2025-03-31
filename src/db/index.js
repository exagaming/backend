import appConfig from '@src/configs/app.config'
import * as databaseConfig from '@src/configs/database.config'
import { initModels, initOperatorDatabase } from '@src/helpers/database.helper'
import { Logger } from '@src/libs/logger'
import Sequelize from 'sequelize'
import { masterDatabaseModels } from './models'

const databaseOptions = databaseConfig[appConfig.get('env') || 'development']

/** @type {Sequelize.Sequelize} */
const sequelize = new Sequelize({ ...databaseOptions })

/** @type {Object.<number, Object.<string, typeof import('sequelize').Model>>} */
const operatorModels = {}

/** @type {Object.<string, typeof import('sequelize').Model>} */
const models = initModels(sequelize, masterDatabaseModels)

sequelize.authenticate().then(() => {
  Logger.info('Database', { message: 'Connected and operator model intialized...' })
}).catch(error => {
  Logger.error('Database', { exception: error })
  throw error
})

const databaseCloseFn = sequelize.close.bind(sequelize)
sequelize.close = async () => {
  await databaseCloseFn()
  Logger.error('Database', { message: 'Closed...' })
}

async function setupOperatorModels () {
  const operators = await sequelize.models.Operator.findAll({ attributes: ['id', 'name'], raw: true, logging: false })
  operators.forEach(operator => {
    operatorModels[operator.id] = initOperatorDatabase(operator.name, sequelize)
  })
}

export { models, operatorModels, sequelize, setupOperatorModels }
