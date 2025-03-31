'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const ChatRule = sequelize.define('ChatRule', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    rules: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    updatedBy: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'chat_rules',
    schema,
    timestamps: true
  })

  ChatRule.associate = models => {
    ChatRule.belongsTo(models.AdminUser, { foreignKey: 'createdBy', as: 'createdByAdmin' })
    ChatRule.belongsTo(models.AdminUser, { foreignKey: 'updatedBy', as: 'updatedByAdmin' })
  }

  return ChatRule
}
