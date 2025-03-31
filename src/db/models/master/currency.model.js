'use strict'

import { CURRENCY_TYPES } from '@src/utils/constants/app.constants'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM(Object.values(CURRENCY_TYPES)),
      allowNull: false,
      defaultValue: CURRENCY_TYPES.FIAT
    },
    precision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'currencies',
    schema: 'public',
    timestamps: true
  })

  Currency.associate = models => {
    if (models.Transaction) Currency.hasMany(models.Transaction, { foreignKey: 'currencyId', as: 'transactions' })
    if (models.SlotGameBet) Currency.hasMany(models.SlotGameBet, { foreignKey: 'currencyId', as: 'slotGameBets' })
    if (models.CrashGameBet) Currency.hasMany(models.CrashGameBet, { foreignKey: 'currencyId', as: 'crashGameBets' })
  }

  return Currency
}
