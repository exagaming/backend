'use strict'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
  const Operator = sequelize.define('Operator', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    companyUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    callbackBaseUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    operatorSecretKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    serviceProviderRevenuePercentage: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'operators',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    underscored: true
  })

  Operator.jsonSchemaOptions = {
    exclude: ['operatorSecretKey']
  }

  Operator.associate = models => {
    Operator.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' })
  }

  return Operator
}
