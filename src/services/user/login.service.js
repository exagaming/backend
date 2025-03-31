import config from '@src/configs/app.config'
import { operatorModels } from '@src/db'
import { ServiceError } from '@src/errors/service.error'
import { setRegisteredUserCount } from '@src/helpers/cache.helpers'
import { initOperatorDatabase } from '@src/helpers/database.helper'
import { getServerSeed } from '@src/helpers/encryption.helpers'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { GetCurrencyService } from '@src/services/common/getCurrency.service'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { AuthenticateService } from '@src/services/operator-callback/authenticate.service'
import { gameUserFinancialTokenCacheKey } from '@src/utils/common.utils'
import { DEFAULT_CURRENCY_PRECISION } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'
import jwt from 'jsonwebtoken'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    gameId: { type: 'string' },
    signInIp: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['signInIp', 'currencyCode', 'operatorUserToken', 'operatorId', 'gameId']
})

export class LoginService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { currencyCode, operatorId, operatorUserToken, gameId } = this.args

    try {
      const operator = await OperatorDetailsService.run({ operatorId }, this.context)
      const currency = await GetCurrencyService.run({ currencyCode }, this.context)

      const authenticationDetails = await AuthenticateService.run({ operatorId, currencyCode, operatorUserToken }, this.context)
      if (currencyCode !== authenticationDetails.wallet.currency) throw messages.INVALID_CURRENCY_CODE

      if (!operatorModels[operator.id]) this.context.dbModels = operatorModels[operator.id] = initOperatorDatabase(operator.name, this.context.sequelize)

      let user = await this.context.dbModels.User.findOne({
        where: { userCode: authenticationDetails.user.id }
      })

      if (!user) {
        user = await this.context.dbModels.User.create({
          userCode: authenticationDetails.user.id,
          userName: authenticationDetails.user.userName,
          lastName: authenticationDetails.user.lastName,
          firstName: authenticationDetails.user.firstName
        })
        setRegisteredUserCount(operatorId)
      } else {
        user.signInIp = this.args.signInIp
        user.lastName = authenticationDetails.user.lastName
        user.firstName = authenticationDetails.user.firstName
        await user.save()
      }

      const accessToken = jwt.sign({
        gameId,
        operatorId,
        userId: user.id,
        operatorUserToken,
        userCode: user.userCode,
        currencyId: currency.id,
        currencyCode: currency.code,
        currencyPrecision: currency?.precision ?? DEFAULT_CURRENCY_PRECISION
      }, config.get('jwt.loginTokenSecret'), { expiresIn: config.get('jwt.loginTokenExpiry') })

      const { nextServerSeedHash: serverSeedHash } = await getServerSeed(user.id, operatorId)
      await Cache.setWithTTL(gameUserFinancialTokenCacheKey(operatorId, user.id), operatorUserToken, config.get('jwt.loginTokenExpiry'))
      const operatorDetailsToShow = {
        id: operator?.id,
        name: operator?.name,
        companyUrl: operator?.companyUrl
      }
      return { user, operator: operatorDetailsToShow, accessToken, serverSeedHash, wallet: authenticationDetails.wallet }
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
