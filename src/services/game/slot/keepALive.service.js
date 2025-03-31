import config from '@src/configs/app.config'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import jwt from 'jsonwebtoken'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    userId: { type: 'string' },
    gameId: { type: 'string' },
    userCode: { type: 'string' },
    currencyId: { type: 'string' },
    operatorId: { type: 'string' },
    currencyCode: { type: 'string' },
    operatorUserToken: { type: 'string' }
  },
  required: ['userId', 'userCode', 'gameId', 'currencyCode', 'operatorId', 'operatorUserToken', 'currencyId']
})

export class KeepAliveService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const Jwt = jwt.sign(this.args, config.get('jwt.loginTokenSecret'), { expiresIn: config.get('jwt.loginTokenExpiry') })
    return { Jwt }
  }
}
