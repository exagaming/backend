import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { OperatorAxios } from '@src/libs/axios/operator.axios'
import ServiceBase from '@src/libs/serviceBase'
import { OperatorDetailsService } from '@src/services/common/operatorDetails.service'
import { messages } from '@src/utils/constants/error.constants'
import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'number' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['operatorUserToken', 'currencyCode', 'operatorId']
})

export class FundsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const operatorId = this.args.operatorId

    try {
      const { callbackBaseUrl, operatorSecretKey } = await OperatorDetailsService.run({ operatorId }, this.context)
      console.log("callbackBaseUrl",callbackBaseUrl)

      const response = await OperatorAxios.funds(callbackBaseUrl, operatorId, operatorSecretKey, {
        token: this.args.operatorUserToken,
        currencyCode: this.args.currencyCode
      })
      console.log("response op",response)
      if (response.status !== OPERATOR_RESPONSE_CODES.SUCCESS) throw messages.OPERATOR_NETWORK_FAILURE

      return response
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
