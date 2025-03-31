'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const UserChat = sequelize.define('UserChat', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    chatLanguageId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    containOffensiveWords: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    schema,
    sequelize,
    paranoid: true,
    timestamps: true,
    underscored: true,
    tableName: 'user_chats'
  })

  UserChat.associate = models => {
    UserChat.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    UserChat.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' })
    UserChat.belongsTo(models.ChatLanguage, { foreignKey: 'chatLanguageId', as: 'chatLanguage' })
  }

  return UserChat
}
