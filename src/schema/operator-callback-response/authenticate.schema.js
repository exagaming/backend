import { OPERATOR_RESPONSE_CODES } from '@src/utils/constants/operator.constants'

export const authenticateResponseSchema = {
  responseSchema: {
    default: {
      type: 'object',
      properties: {
        status: { enum: Object.values(OPERATOR_RESPONSE_CODES) },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            userName: { type: 'string' }
          },
          required: ['id', 'firstName', 'lastName', 'userName']
        },
        wallet: {
          type: 'object',
          properties: {
            balance: { type: 'number' },
            currency: { type: 'string' }
          },
          required: ['balance', 'currency']
        }
      },
      required: ['type', 'user', 'wallet']
    }
  }
}
