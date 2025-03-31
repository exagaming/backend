import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { BET_RESULT, DEFAULT_GAME_ID } from '@src/utils/constants/game.constants'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const RouletteGameBet = sequelize.define('RouletteGameBet', {
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
    betDetails: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true
    },
    betAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    winningNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    winningAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    result: {
      type: DataTypes.ENUM(Object.values(BET_RESULT)),
      allowNull: false,
      defaultValue: BET_RESULT.PENDING
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currentGameSettings: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    clientSeed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serverSeed: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'roulette_game_bets',
    timestamps: true,
    schema,
    indexes: [{
      unique: true,
      fields: [{ name: 'client_seed' }, { name: 'server_seed' }],
      name: 'unique_constraint_on_server_seed_and_client_seed_on_roulette'
    }]
  })

  RouletteGameBet.associate = function (models) {
    RouletteGameBet.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    RouletteGameBet.belongsTo(models.Currency, { as: 'currency', foreignKey: 'currencyId' })
    RouletteGameBet.hasOne(models.Transaction, { as: 'betTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.ROULETTE, transactionType: TRANSACTION_TYPES.BET } })
    RouletteGameBet.hasOne(models.Transaction, { as: 'winTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.ROULETTE, transactionType: TRANSACTION_TYPES.WIN } })
    RouletteGameBet.hasOne(models.Transaction, { as: 'rollbackTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.ROULETTE, transactionType: TRANSACTION_TYPES.ROLLBACK } })
  }

  return RouletteGameBet
}
