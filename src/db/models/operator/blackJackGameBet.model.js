import { TRANSACTION_TYPES } from '@src/utils/constants/app.constants'
import { BLACKJACK_BET_TYPES, BLACKJACK_RESULT } from '@src/utils/constants/blackJack.constants'
import { BET_RESULT, DEFAULT_GAME_ID } from '@src/utils/constants/game.constants'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const BlackJackGameBet = sequelize.define('BlackJackGameBet', {
    id: {
      type: DataTypes.BIGINT,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    roundId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    playerHand: {
      type: DataTypes.ARRAY(DataTypes.STRING({ length: 20 })),
      allowNull: true
    },
    playerPoints: {
      type: DataTypes.SMALLINT,
      allowNull: true
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
    betType: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(BLACKJACK_BET_TYPES)),
      defaultValue: BLACKJACK_BET_TYPES.MAIN
    },
    result: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(BET_RESULT)),
      defaultValue: BET_RESULT.PENDING
    },
    gameResult: {
      allowNull: true,
      type: DataTypes.ENUM(Object.values(BLACKJACK_RESULT))
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'blackjack_game_bets',
    timestamps: true,
    schema,
    indexes: [{
      unique: true,
      fields: [{ name: 'round_id' }, { name: 'bet_type' }],
      name: 'unique_constraint_on_round_detail_id_and_bet_type_on_blackjack_game_bets'
    }]
  })

  BlackJackGameBet.associate = function (models) {
    BlackJackGameBet.belongsTo(models.BlackJackGameRound, { as: 'round', foreignKey: 'roundId' })
    BlackJackGameBet.hasOne(models.Transaction, { as: 'winTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.BLACK_JACK, transactionType: TRANSACTION_TYPES.WIN } })
    BlackJackGameBet.hasOne(models.Transaction, { as: 'betTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.BLACK_JACK, transactionType: TRANSACTION_TYPES.BET } })
    BlackJackGameBet.hasOne(models.Transaction, { as: 'rollbackTransaction', foreignKey: 'betId', scope: { gameId: DEFAULT_GAME_ID.BLACK_JACK, transactionType: TRANSACTION_TYPES.ROLLBACK } })
  }

  return BlackJackGameBet
}
