export const crashGameSchema = {

  // INFO: Get history schema
  getHistorySchema: {
    requestSchema: {},
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          bets: {
            type: 'array',
            items: { $ref: '#/definitions/CrashGameRoundDetail' }
          }
        }
      }
    }
  },

  // INFO: Top bets schema
  getTopBetsSchema: {
    querySchema: {
      type: 'object',
      properties: {
        page: { type: 'number', minimum: 1, default: 1 },
        perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
        orderBy: { enum: ['winningAmount', 'escapeRate'], default: 'winningAmount' }
      }
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          bets: {
            type: 'array',
            items: { $ref: '#/definitions/CrashGameBet' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        }
      }
    }
  },

  // INFO: Get my bets schema
  getMyBetsSchema: {
    querySchema: {
      type: 'object',
      properties: {
        page: { type: 'number' },
        perPage: { type: 'number' }
      }
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          bets: {
            type: 'array',
            items: { $ref: '#/definitions/CrashGameBet' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        }
      }
    }
  },

  // INFO: Cancel bet schema
  cancelBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        betId: { type: 'string' }
      },
      required: ['betId']
    },
    responseSchema: {
      default: { $ref: '#/definitions/CrashGameBet' }
    }
  },

  // INFO: Place bet schema
  placeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        isAutoCashout: { type: 'boolean' },
        autoRate: { type: 'number' },
        betAmount: { type: 'number' }
      },
      required: ['isAutoCashout', 'betAmount']
    },
    responseSchema: {
      default: { $ref: '#/definitions/CrashGameBet' }
    }
  },

  // INFO: Escape bet schema
  escapeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        betId: { type: 'number' }
      },
      required: ['betId']
    },
    responseSchema: {
      default: { $ref: '#/definitions/CrashGameBet' }
    }
  },

  // INFO: Check fairness schema
  checkFairnessSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        roundHash: { type: 'string' }
      },
      required: ['roundHash']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          crashRate: { type: 'number' },
          signature: { type: 'string' }
        }
      }
    }
  }
}
