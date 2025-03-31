import { masterDatabaseModels, operatorDatabaseModels } from '@src/db/models'
import { DataTypes } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').Model[]} models
 */
export function initModels (sequelize, models, schema) {
  const db = {}
  models.forEach(model => {
    const modelInstance = model(sequelize, DataTypes, schema)
    db[modelInstance.name] = modelInstance
  })

  Object.keys(db).forEach(modelName => {
    const model = db[modelName]
    if (model.associate) model.associate(db)
  })

  return db
}

/**
 * @param {string} operatorName
 * @param {import('sequelize').Sequelize} sequelize
 */
export function initOperatorDatabase (operatorName, sequelize) {
  return initModels(sequelize, [...operatorDatabaseModels, ...masterDatabaseModels], operatorName.toLowerCase())
}
