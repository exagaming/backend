export const slotGameSchema = {
  getSlotMyBetsSchema: {
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
            items: { $ref: '#/definitions/SlotGameBet' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        }
      }
    }
  }
}
