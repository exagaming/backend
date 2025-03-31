import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    page: { type: 'number', default: 1, minimum: 1 },
    perPage: { type: 'number', default: 10, maximum: 100 },
    orderBy: { enum: ['id', 'name', 'code'], default: 'name' },
    order: { enum: ['ASC', 'DESC'], default: 'ASC' }
  }
})

export class GetLanguageRoomService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { page, perPage, order, orderBy } = this.args
    const offset = (page - 1) * perPage

    try {
      let chatLanguages = await Cache.get(CACHE_KEYS.CHAT_LANGUAGES)
      if (!chatLanguages) {
        chatLanguages = await this.context.dbModels.ChatLanguage.findAndCountAll({
          raw: true,
          offset,
          limit: perPage,
          order: [[orderBy, order]]
        })
      } else {
        const sortedChatLanguages = _.sortBy(chatLanguages, this.args.orderBy)
        const orderedChatLanguages = order === 'ASC' ? _.reverse(sortedChatLanguages) : sortedChatLanguages
        chatLanguages = {
          rows: _.slice(orderedChatLanguages, offset, perPage * page),
          count: orderedChatLanguages.length
        }
      }

      return { page, chatLanguages: chatLanguages.rows, totalPages: Math.ceil(chatLanguages.length / perPage) }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
