'use strict'

import { GAME_CATEGORY } from '@src/utils/constants/game.constants'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    gameCategory: {
      type: DataTypes.ENUM(Object.values(GAME_CATEGORY)),
      allowNull: false
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    restartable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    launchUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rtp: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'games',
    schema: 'public',
    timestamps: true
  })

  Game.associate = models => {
    if (models.GameSetting) Game.hasOne(models.GameSetting, { foreignKey: 'gameId', as: 'settings' })
    if (models.UserChat) Game.hasMany(models.UserChat, { foreignKey: 'gameId', as: 'userChats' })
    if (models.Transaction) Game.hasMany(models.Transaction, { foreignKey: 'gameId', as: 'transactions' })
    if (models.SlotGameBet) Game.hasMany(models.SlotGameBet, { foreignKey: 'gameId', as: 'slotGameBets' })
    if (models.CrashGameBet) Game.hasMany(models.CrashGameBet, { foreignKey: 'gameId', as: 'crashGameBets' })
    if (models.CrashGameRoundDetail) Game.hasMany(models.CrashGameRoundDetail, { foreignKey: 'gameId', as: 'rounds' })
  }

  return Game
}
