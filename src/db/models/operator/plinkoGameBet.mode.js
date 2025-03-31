import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { BET_RESULT, DEFAULT_GAME_ID } from '@src/utils/constants/game.constants'
import { PLINKO_BALLS, PLINKO_RISK_LEVELS } from '@src/utils/constants/plinko.constants'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const PlinkoGameBet = sequelize.define('PlinkoGameBet', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    numberOfRows: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    riskLevel: {
      type: DataTypes.ENUM(Object.values(PLINKO_RISK_LEVELS)),
      allowNull: false,
      defaultValue: PLINKO_RISK_LEVELS.LOW
    },
    dropDetails: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    winningSlots: {
      type: DataTypes.ARRAY(DataTypes.SMALLINT),
      allowNull: false,
      defaultValue: []
    },
    numberOfBalls: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: PLINKO_BALLS.MINIMUMu
    },
    betAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0
    },
    winningAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
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
    tableName: 'plinko_game_bets',
    timestamps: true,
    schema,
    indexes: [{
      unique: true,
      fields: [{ name: 'client_seed' }, { name: 'server_seed' }],
      name: 'unique_constraint_on_server_seed_and_client_seed_on_plinko'
    }]
  })

  PlinkoGameBet.associate = function (models) {
    PlinkoGameBet.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    PlinkoGameBet.belongsTo(models.Currency, { as: 'currency', foreignKey: 'currencyId' })
    PlinkoGameBet.hasOne(models.Transaction, { as: 'betTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.PLINKO, transactionType: TRANSACTION_TYPES.BET } })
    PlinkoGameBet.hasOne(models.Transaction, { as: 'winTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.PLINKO, transactionType: TRANSACTION_TYPES.WIN } })
    PlinkoGameBet.hasOne(models.Transaction, { as: 'rollbackTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.PLINKO, transactionType: TRANSACTION_TYPES.ROLLBACK } })
  }

  return PlinkoGameBet
}
