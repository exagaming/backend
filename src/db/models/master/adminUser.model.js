'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    parentId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    encryptedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    deletedById: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    deletedAt: {
      type: DataTypes.DATE,
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
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'admin_users',
    schema: 'public',
    timestamps: true
  })

  AdminUser.associate = models => {
    AdminUser.hasMany(models.Client, { foreignKey: 'parentId', as: 'clients' })
    AdminUser.belongsTo(models.AdminRole, { through: models.AdminUsersAdminRole, foreignKey: 'adminUserId', as: 'role' })
  }

  return AdminUser
}
