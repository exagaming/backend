/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const SlotGameBetState = sequelize.define('SlotGameBetState', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    betId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    current: {
      type: DataTypes.JSON,
      allowNull: false
    },
    next: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'slot_game_bet_states',
    schema,
    timestamps: true
  })

  SlotGameBetState.associate = function (models) {
    SlotGameBetState.belongsTo(models.SlotGameBet, { as: 'bet', foreignKey: 'betId' })
  }

  return SlotGameBetState
}
