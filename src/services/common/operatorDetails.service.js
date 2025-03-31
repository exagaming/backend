import { ServiceError } from '@src/errors/service.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import ServiceBase from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { messages } from '@src/utils/constants/error.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    operatorId: { type: 'string' }
  },
  required: ['operatorId']
})

export class OperatorDetailsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { operatorId } = this.args

    try {
      const cachedOperators = await Cache.get(CACHE_KEYS.OPERATORS)
      let operatorDetail = null
      if (cachedOperators) operatorDetail = cachedOperators.find(operator => operator.id === operatorId)
      if (!operatorDetail) {
        operatorDetail = await this.context.dbModels.Operator.findOne({
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          where: { id: operatorId },
          raw: true
        })
      }
      if (!operatorDetail) throw messages.INVALID_OPERATOR_ID
      if (!operatorDetail.isActive) throw messages.OPERATOR_IS_NOT_ACTIVE

      return operatorDetail
    } catch (error) {
      throw new ServiceError(error)
    }
  }
}
