import { ROULETTE_BET_TYPES } from '@src/utils/constants/roulette.constants'

export const rouletteGameSchema = {
  getMyBetsSchema: {
    querySchema: {
      type: 'object',
      properties: {
        page: { type: 'number', minimum: 1, default: 1 },
        perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
      }
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          totalPages: { type: 'number' },
          bets: {
            type: 'array',
            items: { $ref: '#/definitions/RouletteGameBet' }
          }
        }
      }
    }
  },
  placeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        betDetails: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              amount: { type: 'number' },
              betNumber: { type: 'number' },
              betType: { enum: Object.values(ROULETTE_BET_TYPES) }
            },
            required: ['amount', 'betType', 'betNumber']
          }
        },
        clientSeed: { type: 'string' }
      },
      required: ['betDetails', 'clientSeed']
    },
    responseSchema: {
      default: { $ref: '#/definitions/PlinkoGameBet' }
    }
  },
  checkFairnessSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        clientSeed: { type: 'string' },
        serverSeed: { type: 'string' }
      },
      required: ['clientSeed', 'serverSeed']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          winningNumber: { type: 'number' }
        },
        required: ['winningNumber']
      }
    }
  }
}
