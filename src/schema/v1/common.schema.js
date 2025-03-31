export const commonSchema = {
  getCurrenciesSchema: {
    responseSchema: {
      default: {
        type: 'array',
        items: { $ref: '#/definitions/Currency' }
      }
    }
  },
  getGamesSchema: {
    responseSchema: {
      default: {
        type: 'array',
        items: { $ref: '#/definitions/Game' }
      }
    }
  },
  getGameSettingsSchema: {
    responseSchema: {
      default: {
        type: 'array',
        items: { $ref: '#/definitions/GameSetting' }
      }
    }
  }
}
