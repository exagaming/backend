import { BLACKJACK_BET_TYPES } from '@src/utils/constants/blackJack.constants'
import { Op } from 'sequelize'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const BlackJackGameRound = sequelize.define('BlackJackGameRound', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
      type: DataTypes.BIGINT
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    dealerHand: {
      type: DataTypes.ARRAY(DataTypes.STRING({ length: 20 })),
      allowNull: false,
      defaultValue: []
    },
    dealerPoints: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
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
    tableName: 'blackjack_game_rounds',
    timestamps: true,
    schema,
    indexes: [{
      unique: true,
      fields: [{ name: 'client_seed' }, { name: 'server_seed' }],
      name: 'unique_constraint_on_server_seed_and_client_seed_on_blackjack_game_rounds'
    }]
  })

  BlackJackGameRound.associate = function (models) {
    BlackJackGameRound.hasOne(models.BlackJackGameBet, {
      as: 'mainBet',
      foreignKey: 'roundId',
      scope: { [Op.and]: sequelize.where(sequelize.col('mainBet.bet_type'), Op.eq, BLACKJACK_BET_TYPES.MAIN) }
    })
    BlackJackGameRound.hasOne(models.BlackJackGameBet, {
      as: 'splitBet',
      foreignKey: 'roundId',
      scope: { [Op.and]: sequelize.where(sequelize.col('splitBet.bet_type'), Op.eq, BLACKJACK_BET_TYPES.SPLIT) }
    })
    BlackJackGameRound.hasOne(models.BlackJackGameBet, {
      as: 'doubleBet',
      foreignKey: 'roundId',
      scope: { [Op.and]: sequelize.where(sequelize.col('doubleBet.bet_type'), Op.eq, BLACKJACK_BET_TYPES.DOUBLE) }
    })
    BlackJackGameRound.hasOne(models.BlackJackGameBet, {
      as: 'insuranceBet',
      foreignKey: 'roundId',
      scope: { [Op.and]: sequelize.where(sequelize.col('insuranceBet.bet_type'), Op.eq, BLACKJACK_BET_TYPES.INSURANCE) }
    })
    BlackJackGameRound.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
    BlackJackGameRound.belongsTo(models.Currency, { as: 'currency', foreignKey: 'currencyId' })
  }

  return BlackJackGameRound
}
