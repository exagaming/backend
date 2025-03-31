export const userSchema = {
  generateServerSeedSchema: {
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          serverSeedHash: { type: 'string' }
        }
      }
    }
  },
  loginSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        operatorId: { type: 'string' },
        operatorUserToken: { type: 'string' },
        currencyCode: { type: 'string' },
        gameId: { type: 'string' }
      },
      required: ['currencyCode']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          serverSeedHash: { type: 'string' },
          wallet: {
            type: 'object',
            properties: {
              balance: { type: 'number' },
              currency: { type: 'string' }
            }
          },
          user: { $ref: '#/definitions/User' },
          operator: { $ref: '#/definitions/Operator' }
        },
        required: ['accessToken', 'user', 'operator', 'wallet', 'serverSeedHash']
      }
    }
  },
  updateProfileSchema: {
    bodySchema: {
      type: 'object',
      properties: {
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
      required: ['firstName', 'lastName']
    },
    responseSchema: {
      default: { $ref: '#/definitions/User' }
    }
  },
  userDetailSchema: {
    responseSchema: {
      default: { $ref: '#/definitions/User' }
    }
  }
}
