export const CACHE_KEYS = {
  GAMES: 'GAMES',
  OPERATORS: 'OPERATORS',
  CURRENCIES: 'CURRENCIES',
  SERVER_SEED: 'SERVER_SEED',
  GAME_SETTINGS: 'GAME_SETTINGS',
  CHAT_LANGUAGES: 'CHAT_LANGUAGES',
  OFFENSIVE_WORDS: 'OFFENSIVE_WORDS',
  OPERATOR_USER_TOKEN: 'OPERATOR_USER_TOKEN',
  REGISTRATION_USERS: 'REGISTRATION_USERS',
  GAMBLE_USERS: 'GAMBLE_USERS'
}

export const MAX_CHAT_CHARACTERS = 200

export const DELETED_MESSAGE = 'Deleted because of offensive content.'

export const URL_CHAT_MESSAGE = 'Heads up! This message was removed due to external link.'

export const CURRENCY_TYPES = {
  FIAT: 'fiat',
  CRYPTO: 'crypto'
}

export const DEFAULT_CURRENCY_PRECISION = 2

// TRANSACTION CONSTANTS STARTS
export const TRANSACTION_TYPES = {
  BET: 'bet',
  WIN: 'win',
  ROLLBACK: 'rollback'
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed'
}
// TRANSACTION CONSTANTS END
