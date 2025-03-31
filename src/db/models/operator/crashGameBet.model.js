import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const CrashGameBet = sequelize.define('CrashGameBet', {
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
    roundId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    isAutoCashout: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    autoRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    escapeRate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    betAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    winningAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
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
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'crash_game_bets',
    schema,
    timestamps: true
  })

  CrashGameBet.associate = function (models) {
    CrashGameBet.hasOne(models.Transaction, {
      as: 'betTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.BET,
        [Op.and]: sequelize.where(sequelize.col('betTransaction.game_id'), Op.eq, sequelize.col('CrashGameBet.game_id'))
      }
    })
    CrashGameBet.hasOne(models.Transaction, {
      as: 'winTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.WIN,
        [Op.and]: sequelize.where(sequelize.col('winTransaction.game_id'), Op.eq, sequelize.col('CrashGameBet.game_id'))
      }
    })
    CrashGameBet.hasOne(models.Transaction, {
      as: 'rollbackTransaction',
      foreignKey: 'betId',
      constraints: false,
      scope: {
        transactionType: TRANSACTION_TYPES.ROLLBACK,
        [Op.and]: sequelize.where(sequelize.col('rollbackTransaction.game_id'), Op.eq, sequelize.col('CrashGameBet.game_id'))
      }
    })
    CrashGameBet.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' })
    CrashGameBet.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    CrashGameBet.belongsTo(models.Currency, { foreignKey: 'currencyId', as: 'currency' })
    CrashGameBet.belongsTo(models.CrashGameRoundDetail, { foreignKey: 'roundId', as: 'roundDetail' })
  }

  return CrashGameBet
}
