import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    currencyCode: { type: 'string' }
  },
  required: ['currencyCode']
})

export class GetCurrencyService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { currencyCode } = this.args

    try {
      const cachedCurrencies = await Cache.get(CACHE_KEYS.CURRENCIES)
      let currency = null

      if (cachedCurrencies) currency = cachedCurrencies.find(currency => currency.code === this.args.currencyCode)
      if (!currency) {
        currency = await this.context.dbModels.Currency.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { code: currencyCode },
          raw: true
        })
      }
      if (!currency) throw messages.INVALID_CURRENCY_CODE

      return currency
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
