import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { offensiveWordsCacheKey } from '@src/utils/common.utils'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'string' }
  },
  required: ['operatorId']
})

export class GetOffensiveWordsListService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const key = offensiveWordsCacheKey(this.args.operatorId)
    try {
      let offensiveWords = await Cache.get(key)
      if (!offensiveWords) {
        offensiveWords = await this.context.dbModels.OffensiveWord.findAll({ raw: true })
        await Cache.set(key, offensiveWords)
      }

      return offensiveWords.map(row => row.word)
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
