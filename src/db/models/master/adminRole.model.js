'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const AdminRole = sequelize.define('AdminRole', {
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
    resourceType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resourceId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'admin_roles',
    schema: 'public',
    timestamps: true,
    indexes: [{
      name: 'index_admin_roles_on_resource_type_and_resource_id',
      fields: [
        { name: 'resource_type' },
        { name: 'resource_id' }
      ]
    }]
  })

  AdminRole.associate = models => {
    AdminRole.belongsToMany(models.AdminUser, { through: models.AdminUsersAdminRole, foreignKey: 'adminRoleId', as: 'adminUsers' })
  }
  return AdminRole
}
