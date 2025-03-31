'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const GameSetting = sequelize.define('GameSetting', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    minBet: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '{}'
    },
    maxBet: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '{}'
    },
    maxProfit: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '{}'
    },
    jackpot: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    },
    houseEdge: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 4.0
    },
    minOdds: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 1.0
    },
    maxOdds: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 20.0
    },
    minAutoRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 1.01
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    paranoid: true,
    underscored: true,
    tableName: 'game_settings',
    schema,
    timestamps: true
  })

  GameSetting.associate = models => {
    GameSetting.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' })
  }

  return GameSetting
}
