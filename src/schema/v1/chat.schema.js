export const chatSchema = {
  getLanguageRoomsSchema: {
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          chatLanguages: {
            type: 'array',
            items: { $ref: '#/definitions/ChatLanguage' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        },
        required: ['chatLanguages', 'page', 'totalPages']
      }
    }
  },
  getMessagesSchema: {
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: { $ref: '#/definitions/UserChat' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        },
        required: ['messages', 'page', 'totalPages']
      }
    }
  },
  sendMessageSchema: {
    bodySchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        chatLanguageId: { type: 'string' },
        gameId: { type: 'string' }
      }
    },
    responseSchema: {
      default: {
        type: 'object',
        properties: {
          messages: {
            type: 'array',
            items: { $ref: '#/definitions/UserChat' }
          },
          page: { type: 'number' },
          totalPages: { type: 'number' }
        },
        required: ['messages', 'page', 'totalPages']
      }
    }
  }
}
