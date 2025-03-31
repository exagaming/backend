import { alignDatabaseDateFilter } from '@src/helpers/common.helpers'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { Op, Sequelize } from 'sequelize'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    chatLanguageId: { type: 'string' },
    searchString: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    status: { type: 'string' },
    gameId: { type: 'string' },
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, maximum: 100 },
    order: { enum: ['ASC', 'DESC'], default: 'DESC' },
    orderBy: { enum: ['id', 'actioneeId', 'recipientId'], default: 'id' }
  },
  required: ['chatLanguageId', 'gameId']
})

export class GetUserChatService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { searchString, startDate, endDate, status, chatLanguageId, page, perPage, gameId } = this.args

    try {
      const where = { chatLanguageId, gameId }

      if (status) where.status = status
      if (searchString) where.message = { [Op.iLike]: `%${searchString}%` }
      if (startDate || endDate) where.createdAt = alignDatabaseDateFilter(startDate, endDate)

      const messages = await this.context.dbModels.UserChat.findAndCountAll({
        where,
        attributes: [
          'id',
          'createdAt',
          [Sequelize.literal('CASE WHEN contain_offensive_words = true THEN \'Contains offensive words\' ELSE message END'), 'message']
        ],
        include: [{
          model: this.context.dbModels.User,
          as: 'user',
          attributes: ['id', 'userName']
        }, {
          model: this.context.dbModels.Game,
          as: 'game',
          attributes: ['id', 'name']
        }],
        order: [[this.args.orderBy, this.args.order]],
        limit: perPage,
        offset: (page - 1) * perPage,
        transaction: this.context.sequelizeTransaction
      })

      return { page, messages: messages.rows, totalPages: Math.ceil(messages.count / perPage) }
    } catch (error) {
      throw Error(error)
    }
  }
}
