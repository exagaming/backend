import { PLINKO_BALLS, PLINKO_RISK_LEVELS, PLINKO_ROWS } from '@src/utils/constants/plinko.constants'

export const plinkoGameSchema = {
  getMyBetsSchema: {
    querySchema: {
      type: 'object',
      properties: {
        page: { type: 'number', minimum: 1, default: 1 },
        perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 }
      },
      required: ['page', 'perPage']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          totalPages: { type: 'number' },
          bets: {
            type: 'array',
            items: { $ref: '#/definitions/PlinkoGameBet' }
          }
        }
      }
    }
  },
  placeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        betAmount: { type: 'number' },
        clientSeed: { type: 'string' },
        riskLevel: { enum: Object.values(PLINKO_RISK_LEVELS), default: PLINKO_RISK_LEVELS.LOW },
        numberOfRows: { type: 'number', minimum: PLINKO_ROWS.MINIMUM, maximum: PLINKO_ROWS.MAXIMUM, default: PLINKO_ROWS.MINIMUM },
        numberOfBalls: { type: 'number', minimum: PLINKO_BALLS.MINIMUM, maximum: PLINKO_BALLS.MAXIMUM, default: PLINKO_BALLS.MINIMUM }
      },
      required: ['numberOfRows', 'riskLevel', 'clientSeed', 'betAmount', 'numberOfBalls']
    },
    responseSchema: {
      default: {
        anyOf: [{
          type: 'object',
          properties: {
            nextServerSeedHash: { type: 'string' },
            bet: { $ref: '#/definitions/PlinkoGameBet' }
          },
          required: ['bet', 'nextServerSeedHash'],
          additionalProperties: false
        }, {
          type: 'object',
          properties: {
            success: { type: 'object' },
            message: { type: 'string' }
          },
          required: ['success', 'message'],
          additionalProperties: false
        }]
      }
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
          dropDetails: { type: 'array', items: { type: 'string' } },
          winningSlots: { type: 'array', items: { type: 'number' } },
          multipliers: { type: 'array', items: { type: 'number' } },
          numberOfRows: { type: 'number' }
        },
        required: ['dropDetails']
      }
    }
  }
}
