import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' }
  },
  required: ['userId']
})

export class GetUserDetailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const user = await this.context.dbModels.User.findOne({ where: { id: this.args.userId } })
    return user
  }
}
