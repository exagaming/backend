'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: false
    },
    supportSkype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    supportEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billingSkype: {
      type: DataTypes.STRING,
      allowNull: true
    },
    billingEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deletedById: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    twoFactorSecretKey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'clients',
    paranoid: true,
    schema: 'public',
    timestamps: true
  })

  Client.associate = models => {
    Client.belongsTo(models.AdminUser, { foreignKey: 'parentId', as: 'parent' })
    Client.hasMany(models.Operator, { foreignKey: 'clientId', as: 'operators' })
  }

  return Client
}
