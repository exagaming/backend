/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const SlotGameBet = sequelize.define('SlotGameBet', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    winningCombination: {
      type: DataTypes.JSON,
      allowNull: true
    },
    baseSpinWinningCombination: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true
    },
    freeSpinWinningCombination: {
      type: DataTypes.JSON,
      allowNull: true
    },
    betAmount: {
      allowNull: false,
      type: DataTypes.DECIMAL(20, 8)
    },
    freeSpinsLeft: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    totalFreeSpinsAwarded: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    winningAmount: {
      allowNull: true,
      type: DataTypes.DECIMAL
    },
    freeSpinWinningAmount: {
      allowNull: true,
      type: DataTypes.DECIMAL
    },
    result: {
      allowNull: true,
      type: DataTypes.STRING
    },
    currencyId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    currentGameSettings: {
      allowNull: false,
      type: DataTypes.JSONB
    },
    player: {
      type: DataTypes.JSON
    },
    clientSeed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serverSeed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roundType: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'slot_game_bets',
    schema,
    timestamps: true
  })

  SlotGameBet.associate = function (models) {
    SlotGameBet.belongsTo(models.Game, { as: 'game', foreignKey: 'gameId' })
    SlotGameBet.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    SlotGameBet.belongsTo(models.Currency, { as: 'currency', foreignKey: 'currencyId' })
    SlotGameBet.hasMany(models.Transaction, { as: 'transactions', foreignKey: 'betId' })
    SlotGameBet.hasMany(models.SlotGameBetState, { as: 'betStates', foreignKey: 'betId' })
  }

  return SlotGameBet
}
