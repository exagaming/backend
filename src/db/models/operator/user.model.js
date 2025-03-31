'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const User = sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    signInIp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    blockChatTillDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isBlockChatPermanently: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'users',
    schema,
    timestamps: true
  })

  User.associate = models => {
    User.hasMany(models.UserChat, { foreignKey: 'userId', as: 'chat' })
    User.hasMany(models.Transaction, { foreignKey: 'userId', as: 'transactions' })
  }

  return User
}
