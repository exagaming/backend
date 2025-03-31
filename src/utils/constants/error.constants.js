export const messages = {
  NO_RUNNING_ROUND_FOUND: 'NO_RUNNING_ROUND_FOUND',
  NO_PLACED_BET_FOUND: 'NO_PLACED_BET_FOUND',
  USER_DOES_NOT_EXISTS: 'USER_DOES_NOT_EXISTS',
  INVALID_OPERATOR_ID: 'INVALID_OPERATOR_ID',
  INVALID_CURRENCY_CODE: 'INVALID_CURRENCY_CODE',
  OPERATOR_UNREACHABLE: 'OPERATOR_UNREACHABLE',
  OPERATOR_UNAVAILABLE: 'OPERATOR_UNAVAILABLE',
  MISSING_TOKEN: 'MISSING_TOKEN',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_BLOCKED_FROM_SENDING_MESSAGES: 'USER_BLOCKED_FROM_SENDING_MESSAGES',
  EXCEEDS_MESSAGE_LENGTH: 'EXCEEDS_MESSAGE_LENGTH',
  INVALID_AUTO_RATE: 'INVALID_AUTO_RATE',
  BET_AMOUNT_NOT_IN_LIMIT: 'BET_AMOUNT_NOT_IN_LIMIT',
  BLOCKED_TRANSACTION: 'BLOCKED_TRANSACTION',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  TRANSACTION_ALREADY_PROCESSED: 'TRANSACTION_ALREADY_PROCESSED',
  SERVER_SEED_NOT_FOUND: 'SERVER_SEED_NOT_FOUND',
  UNFINISHED_SLOT_GAME_BET_EXISTS: 'UNFINISHED_SLOT_GAME_BET_EXISTS',
  BASE_SLOT_GAME_BET_NOT_EXISTS: 'BASE_SLOT_GAME_BET_NOT_EXISTS',
  INVALID_GAME_ID: 'INVALID_GAME_ID',
  NOT_ENOUGH_BALANCE: 'NOT_ENOUGH_BALANCE',
  OPERATOR_IS_NOT_ACTIVE: 'OPERATOR_IS_NOT_ACTIVE',
  INVALID_TYPE: 'INVALID_TYPE',
  INVALID_ROUND_TYPE: 'INVALID_ROUND_TYPE',
  INVALID_BET_DETAILS: 'INVALID_BET_DETAILS',
  MINE_TILE_ALREADY_OPENED: 'MINE_TILE_ALREADY_OPENED',
  NO_OPEN_TILE_FOUND: 'NO_OPEN_TILE_FOUND',
  INVALID_SEED: 'INVALID_SEED',
  PLEASE_CONTACT_OPERATOR: 'PLEASE_CONTACT_OPERATOR',
  BET_AMOUNT_BELOW_MIN_RANGE: 'BET_AMOUNT_BELOW_MIN_RANGE',
  BET_AMOUNT_EXCEEDS_MAX_RANGE: 'BET_AMOUNT_EXCEEDS_MAX_RANGE',
  PREVIOUS_BET_NOT_COMPLETED: 'PREVIOUS_BET_NOT_COMPLETED',
  INSURANCE_BET_ALREADY_PLACED: 'INSURANCE_BET_ALREADY_PLACED',
  SPLIT_BET_ALREADY_PLACED: 'SPLIT_BET_ALREADY_PLACED',
  DOUBLE_BET_ALREADY_PLACED: 'DOUBLE_BET_ALREADY_PLACED',
  BET_CAN_NOT_BE_SPLITTED: 'BET_CAN_NOT_BE_SPLITTED',
  BET_CAN_NOT_BE_ENSURED: 'BET_CAN_NOT_BE_ENSURED',
  BET_CAN_NOT_BE_DOUBLED: 'BET_CAN_NOT_BE_DOUBLED',
  CURRENCY_NOT_SUPPORTED_FOR_LINE_BET: 'CURRENCY_NOT_SUPPORTED_FOR_LINE_BET',
  SIGNATURE_NOT_VERIFIED: 'SIGNATURE_NOT_VERIFIED',
  USER_IS_BLOCKED: 'USER_IS_BLOCKED',
  UNKNOWN_OPERATOR_ERROR: 'UNKNOWN_OPERATOR_ERROR',
  OPERATOR_NETWORK_FAILURE: 'OPERATOR_NETWORK_FAILURE',
  INVALID_ROUND_HASH: 'INVALID_ROUND_HASH',
  PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE: 'PLEASE_CONSIDER_DENYING_OR_ACCEPTING_INSURANCE',
  INVALID_MINE_COUNT: 'INVALID_MINE_COUNT',
  INVALID_JACKPOT_INDEX: 'INVALID_JACKPOT_INDEX'
}

export const STATUS_CODES = {
  200: 'OK',
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  408: 'REQUEST_TIMEOUT',
  500: 'INTERNAL_SERVER_ERROR',
  503: 'SERVICE_UNAVAILABLE',
  502: 'BAD_GATEWAY',
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  BAD_GATEWAY: 502
}

export const errorTypes = {
  RequestInputValidationErrorType: {
    name: 'RequestInputValidationError',
    statusCode: STATUS_CODES.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3001
  },
  SocketRequestInputValidationErrorType: {
    name: 'SocketRequestInputValidationError',
    statusCode: STATUS_CODES.BAD_REQUEST,
    isOperational: true,
    description: messages.PLEASE_CHECK_REQUEST_DATA,
    errorCode: 3002
  },
  InternalServerErrorType: {
    name: 'InternalServerError',
    statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    isOperational: true,
    description: messages.INTERNAL_SERVER_ERROR,
    errorCode: 3003
  },
  InvalidSocketArgumentErrorType: {
    name: 'InvalidSocketArgumentError',
    statusCode: STATUS_CODES.BAD_REQUEST,
    isOperational: true,
    description: messages.SOCKET_PROVIDE_PROPER_ARGUMENTS,
    errorCode: 3004
  },
  AuthenticationErrorType: {
    name: 'AuthenticationErrorType',
    statusCode: STATUS_CODES.UNAUTHORIZED,
    isOperational: true,
    description: messages.ACCESS_TOKEN_EXPIRED_OR_NOT_PASSED,
    errorCode: 3005
  },
  ServiceErrorType: {
    name: 'ServiceErrorType',
    statusCode: STATUS_CODES.BAD_REQUEST,
    isOperational: true,
    description: '',
    errorCode: 3006
  }
}
