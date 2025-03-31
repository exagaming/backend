import { MINE_MAX_TILE_COUNT, MINE_MIN_TILE_COUNT } from '@src/utils/constants/mine.constants'

export const mineGameSchema = {
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
            items: { $ref: '#/definitions/MineGameBet' }
          }
        }
      }
    }
  },
  getUnfinishedGameStateSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/MineGameBet' }
    }
  },
  placeBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        mineCount: { type: 'number' },
        gameId: { type: 'number',
          allowNull: false,
          defaultValue: 32 // Ensure this is present
         },

        betAmount: { type: 'number' },
        clientSeed: { type: 'string' }
      },
      required: ['mineCount', 'clientSeed', 'betAmount', 'gameId']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          nextServerSeedHash: { type: 'string' },
          bet: { $ref: '#/definitions/MineGameBet' }
        },
        required: ['bet', 'nextServerSeedHash']
      }
    }
  },
  placeAutoBetSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        mineCount: { type: 'number' },
        betAmount: { type: 'string' },
        clientSeed: { type: 'string' },
        tiles: { type: 'array', uniqueItems: true, minItems: 1, items: { type: 'number', minimum: MINE_MIN_TILE_COUNT, maximum: MINE_MAX_TILE_COUNT } }
      },
      required: ['mineCount', 'clientSeed', 'betAmount', 'tiles']
    },
    responseSchema: {
      default: {
        anyOf: [{
          type: 'object',
          properties: {
            nextServerSeedHash: { type: 'string' },
            bet: { $ref: '#/definitions/MineGameBet' }
          },
          required: ['bet', 'nextServerSeedHash']
        }, {
          type: 'object',
          properties: {
            success: { type: 'object' },
            message: { type: 'string' }
          }
        }]
      }
    }
  },
  cancelBetSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/MineGameBet' }
    }
  },
  cashOutBetSchema: {
    bodySchema: {},
    responseSchema: {
      default: { $ref: '#/definitions/MineGameBet' }
    }
  },
  openTileSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        tile: { type: 'number' }
      },
      required: ['tile']
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          mineTile: { type: 'boolean' },
          bet: { type: 'object' }
        }
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
          mines: { type: 'array', items: { type: 'number' } }
        },
        required: ['mines']
      }
    }
  }
}
