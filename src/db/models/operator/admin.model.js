'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const Admin = sequelize.define('Admin', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING
    },
    encryptedPassword: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    additionalInfo: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'admins',
    schema,
    paranoid: true,
    timestamps: true,
    underscored: true
  })

  return Admin
}
