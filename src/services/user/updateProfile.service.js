import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { messages } from '@src/utils/constants/error.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    firstName: {
      type: 'string',
      pattern: '^[a-zA-Z]*$',
      minLength: 2,
      maxLength: 50
    },
    lastName: {
      type: 'string',
      pattern: '^[a-zA-Z]*$',
      minLength: 2,
      maxLength: 50
    }
  },
  required: ['userId', 'firstName', 'lastName']
})

export class UpdateProfileService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { sequelizeTransaction } = this.context

    try {
      const user = await this.context.dbModels.User.findOne({
        attributes: { exclude: ['createdAt', 'updatedAt', 'blockChatTillDate', 'isBlockChatPermanently', 'signInIp'] },
        where: { id: this.args.userId },
        transaction: sequelizeTransaction
      })
      if (!user) throw messages.USER_DOES_NOT_EXISTS

      user.firstName = this.args.firstName
      user.lastName = this.args.lastName

      await user.save({ transaction: sequelizeTransaction })

      return user
    } catch (error) {
      throw Error(error)
    }
  }
}
