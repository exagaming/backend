import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'

export class GetCurrenciesService extends ServiceBase {
  async run () {
    let currencies = await Cache.get(CACHE_KEYS.CURRENCIES)
    if (!currencies) {
      currencies = await this.context.dbModels.Currency.findAll({ raw: true })
    }

    return currencies
  }
}
