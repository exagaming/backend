'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const AdminUsersAdminRole = sequelize.define('AdminUsersAdminRole', {
    adminUserId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    adminRoleId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    underscored: true,
    schema: 'public',
    tableName: 'admin_users_admin_roles',
    indexes: [{
      name: 'index_admin_users_roles_on_admin_users_roles',
      fields: [
        { name: 'admin_user_id' },
        { name: 'admin_role_id' }
      ]
    }]
  })

  AdminUsersAdminRole.associate = models => {
    AdminUsersAdminRole.belongsTo(models.AdminUser, { foreignKey: 'adminUserId', as: 'adminUser' })
    AdminUsersAdminRole.belongsTo(models.AdminRole, { foreignKey: 'adminRoleId', as: 'adminRole' })
  }

  return AdminUsersAdminRole
}
