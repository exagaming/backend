export const blackjackGameSchema = {
  getMyBetsSchema: {
    bodySchema: {
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
            items: { $ref: '#/definitions/BlackJackGameRound' }
          }
        }
      }
    }
  },
  getUnfinishedBetSchema: {
    bodySchema: {},
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          canBetInsured: { type: 'boolean' },
          canBetSplitted: { type: 'boolean' },
          canBetDoubled: { type: 'boolean' },
          round: { $ref: '#/definitions/BlackJackGameRound' }
        },
        required: ['round', 'canBetInsured', 'canBetSplitted'],
        additionalProperties: false
      }
    }
  },
  hitSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/BlackJackGameBet' }
    }
  },
  placeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        betAmount: { type: 'number' },
        clientSeed: { type: 'string' }
      },
      required: ['betAmount', 'clientSeed']
    },
    responseSchema: {
      default: {
        anyOf: [{
          type: 'object',
          properties: {
            canBetInsured: { type: 'boolean' },
            canBetSplitted: { type: 'boolean' },
            canBetDoubled: { type: 'boolean' },
            nextServerSeedHash: { type: 'string' },
            round: { $ref: '#/definitions/BlackJackGameRound' }
          },
          required: ['round', 'nextServerSeedHash', 'canBetInsured', 'canBetSplitted'],
          additionalProperties: false
        }, {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' }
          },
          required: ['success', 'message'],
          additionalProperties: false
        }]
      }
    }
  },
  placeDoubleBetSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/BlackJackGameRound' }
    }
  },
  placeInsuranceBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        acceptInsurance: { type: 'boolean', default: true }
      }
    },
    responseSchema: {
      default: { $ref: '#/definitions/BlackJackGameBet' }
    }
  },
  placeSplitBetSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/BlackJackGameBet' }
    }
  },
  standSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/BlackJackGameRound' }
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
          cards: { type: 'array', items: { type: 'string' } }
        },
        required: ['cards']
      }
    }
  }
}
