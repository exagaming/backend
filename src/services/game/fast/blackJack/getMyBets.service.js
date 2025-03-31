import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { BET_RESULT } from '@src/utils/constants/game.constants'
import { Op } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    currencyId: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
  },
  required: ['userId', 'currencyId']
})

export class GetMyBetsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      context: {
        dbModels: {
          BlackJackGameBet: BlackJackGameBetModel,
          BlackJackGameRound: BlackJackGameRoundModel
        }
      },
      args: { userId, currencyId, page, perPage }
    } = this

    try {
      const blackJackGameBets = await BlackJackGameRoundModel.findAndCountAll({
        where: { userId, currencyId },
        include: [{
          model: BlackJackGameBetModel,
          as: 'mainBet',
          where: {
            result: { [Op.in]: [BET_RESULT.WON, BET_RESULT.LOST, BET_RESULT.CANCELLED] }
          },
          required: true
        }, {
          model: BlackJackGameBetModel,
          as: 'insuranceBet'
        }, {
          model: BlackJackGameBetModel,
          as: 'splitBet'
        }, {
          model: BlackJackGameBetModel,
          as: 'doubleBet'
        }],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return { page, bets: blackJackGameBets.rows, totalPages: Math.ceil(blackJackGameBets.count / perPage) }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
