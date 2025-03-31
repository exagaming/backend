import { CRASH_GAME_STATE } from '@src/utils/constants/game.constants'
import crypto from 'crypto'

/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @param {string} schema
 */
export default (sequelize, DataTypes, schema) => {
  const CrashGameRoundDetail = sequelize.define('CrashGameRoundDetail', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    roundId: {
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    crashRate: {
      allowNull: true,
      type: DataTypes.DOUBLE
    },
    roundState: {
      allowNull: false,
      type: DataTypes.ENUM(Object.values(CRASH_GAME_STATE))
    },
    roundHash: {
      allowNull: false,
      type: DataTypes.STRING
    },
    roundSignature: {
      allowNull: false,
      type: DataTypes.STRING
    },
    onHoldAt: {
      allowNull: true,
      type: DataTypes.DATE
    },
    currentGameSettings: {
      allowNull: false,
      type: DataTypes.JSONB
    }
  }, {
    schema,
    sequelize,
    underscored: true,
    tableName: 'crash_game_round_details',
    timestamps: true
  })

  CrashGameRoundDetail.beforeValidate((round) => {
    round.roundSignature = crypto.createHash('md5').update(`${Number(round.crashRate).toFixed(2)}-${round.roundHash}`).digest('hex')
  })

  CrashGameRoundDetail.associate = function (models) {
    CrashGameRoundDetail.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' })
    CrashGameRoundDetail.hasMany(models.CrashGameBet, { foreignKey: 'roundId', as: 'bets' })
  }

  return CrashGameRoundDetail
}
