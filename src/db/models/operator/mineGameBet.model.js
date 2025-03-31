import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const MineGameBet = sequelize.define('MineGameBet', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'user_id'
    },
    mineCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'mine_count'
    },
    mineTiles: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'mine_tiles'
    },
    openTiles: {
      type: DataTypes.ARRAY(DataTypes.SMALLINT),
      allowNull: false,
      defaultValue: [],
      field: 'open_tiles'
    },
    betAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      field: 'bet_amount'
    },
    winningAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      field: 'winning_amount'
    },
    result: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(BET_RESULT)),
      defaultValue: BET_RESULT.PENDING
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'currency_id'
    },

    // --- JS field `gameId` => physical column `game_id` ---
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'game_id'
    },

    currentGameSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'current_game_settings'
    },
    clientSeed: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'client_seed'
    },
    serverSeed: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'server_seed'
    }
  }, {
    sequelize,
    tableName: 'mine_game_bets',
    // Make sure to define the model name so aliases work correctly:
    modelName: 'MineGameBet',
    underscored: true,
    timestamps: true,
    schema,
    indexes: [
      {
        unique: true,
        fields: ['client_seed', 'server_seed'],
        name: 'unique_constraint_on_server_seed_and_client_seed_on_mine'
      }
    ]
  })

  MineGameBet.associate = function (models) {
    // 1. belongsTo Game
    MineGameBet.belongsTo(models.Game, {
      foreignKey: 'gameId',
      as: 'game'
    })

    // 2. belongsTo User
    MineGameBet.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })

    // 3. belongsTo Currency
    MineGameBet.belongsTo(models.Currency, {
      as: 'currency',
      foreignKey: 'currencyId'
    })

    // === Transaction Associations ===
    // Using "MineGameBet.game_id" (physical column) in the scope instead of "MineGameBet.gameId"
    MineGameBet.hasOne(models.Transaction, {
      as: 'betTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.BET,
        [Op.and]: sequelize.where(
          sequelize.col('betTransaction.game_id'),
          Op.eq,
          // alias is "MineGameBet" with the physical column "game_id"
          sequelize.col('MineGameBet.game_id')
        )
      }
    })

    MineGameBet.hasOne(models.Transaction, {
      as: 'winTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.WIN,
        [Op.and]: sequelize.where(
          sequelize.col('winTransaction.game_id'),
          Op.eq,
          sequelize.col('MineGameBet.game_id')
        )
      }
    })

    MineGameBet.hasOne(models.Transaction, {
      as: 'rollbackTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.ROLLBACK,
        [Op.and]: sequelize.where(
          sequelize.col('rollbackTransaction.game_id'),
          Op.eq,
          sequelize.col('MineGameBet.game_id')
        )
      }
    })
  }

  return MineGameBet
}
