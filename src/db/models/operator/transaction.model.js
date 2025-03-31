'use strict'

import { TRANSACTION_STATUS, TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { DEFAULT_GAME_ID } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(TRANSACTION_STATUS)),
      allowNull: true
    },
    comments: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transactionType: {
      type: DataTypes.ENUM(Object.values(TRANSACTION_TYPES)),
      allowNull: true
    },
    transactionId: {
      type: DataTypes.UUIDV4,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    debitTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    betId: {
      allowNull: true,
      type: DataTypes.BIGINT
    },
    reasonPhrase: {
      allowNull: true,
      type: DataTypes.STRING
    },
    reasonCode: {
      allowNull: true,
      type: DataTypes.BIGINT
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'transactions',
    schema,
    timestamps: true
  })

  Transaction.associate = models => {
    Transaction.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' })
    Transaction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    Transaction.belongsTo(models.Currency, { foreignKey: 'currencyId', as: 'currency' })
    Transaction.belongsTo(models.MineGameBet, { foreignKey: 'betId', as: 'mineGameBets', scope: { gameId: DEFAULT_GAME_ID.MINE } })
    Transaction.belongsTo(models.PlinkoGameBet, { foreignKey: 'betId', as: 'plinkoGameBets', scope: { gameId: DEFAULT_GAME_ID.PLINKO } })
    Transaction.belongsTo(models.RouletteGameBet, { foreignKey: 'betId', as: 'rouletteGameBets', scope: { gameId: DEFAULT_GAME_ID.ROULETTE } })
    Transaction.belongsTo(models.BlackJackGameBet, { foreignKey: 'betId', as: 'blackJackGameBets', scope: { gameId: DEFAULT_GAME_ID.BLACK_JACK } })
    Transaction.belongsTo(models.CrashGameBet, {
      foreignKey: 'betId',
      as: 'crashGameBets',
      constraints: false,
      scope: { [Op.and]: sequelize.where(sequelize.col('transactions.game_id'), Op.eq, sequelize.col('crash_game_bets.game_id')) }
    })
    Transaction.belongsTo(models.SlotGameBet, {
      foreignKey: 'betId',
      as: 'slotGameBets',
      constraints: false,
      scope: { [Op.and]: sequelize.where(sequelize.col('transactions.game_id'), Op.eq, sequelize.col('slot_game_bets.game_id')) }
    })
  }

  return Transaction
}
