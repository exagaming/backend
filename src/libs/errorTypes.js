import { STATUS_CODES } from '@src/utils/constants/error.constants'

// common errors for all the backend services

export const RequestInputValidationErrorType = {
  name: 'RequestInputValidationError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3001
}

export const ResponseValidationErrorType = {
  name: 'ResponseInputValidationError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation failed please refer json schema of response',
  errorCode: 3002
}

export const SocketRequestInputValidationErrorType = {
  name: 'SocketRequestInputValidationError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Please check the request data',
  errorCode: 3003
}

export const SocketResponseValidationErrorType = {
  name: 'SocketResponseValidationError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: false,
  description: 'Response validation of socket failed please refer json schema of response',
  errorCode: 3004
}

export const InternalServerErrorType = {
  name: 'InternalServerError',
  statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
  isOperational: true,
  description: 'Internal Server Error',
  errorCode: 3005
}

export const InvalidSocketArgumentErrorType = {
  name: 'InvalidSocketArgumentError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide, proper arguments eventName, [payloadObject], and [callback]',
  errorCode: 3006
}

export const InvalidCredentialsErrorType = {
  name: 'InvalidCredentials',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Credentials does not match',
  errorCode: 3007
}

export const InvalidTokenErrorType = {
  name: 'InvalidToken',
  statusCode: STATUS_CODES.UNAUTHORIZED,
  isOperational: true,
  description: 'Either access token not passed or it is expired',
  errorCode: 3008
}

export const UserNotExistsErrorType = {
  name: 'UserNotExists',
  statusCode: STATUS_CODES.NOT_FOUND,
  isOperational: true,
  description: 'User does not exists',
  errorCode: 3009
}

export const InvalidCurrencyCodeErrorType = {
  name: 'InvalidCurrencyCodeError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Currency code is not valid or it is not supported please check it',
  errorCode: 3010
}

export const OperatorPlayerUnAuthenticatedErrorType = {
  name: 'OperatorPlayerUnAuthenticated',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Operator player Unauthenticated',
  errorCode: 3011
}

export const InvalidGameTypeErrorType = {
  name: 'InvalidGameTypeError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No settings found for the provided game type',
  errorCode: 3012
}

export const InvalidGameRoundErrorType = {
  name: 'InvalidGameRoundError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No game found for the provided game details',
  errorCode: 3013
}

export const NoRoundRunningErrorType = {
  name: 'NoRoundRunningError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No round is running as of now',
  errorCode: 3014
}

export const NoPlacedBetFoundErrorType = {
  name: 'NoPlacedBetFoundError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No placed bet found',
  errorCode: 3015
}

export const NoUserFoundErrorType = {
  name: 'NoUserFoundError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'User not found with the specified data',
  errorCode: 3016
}

export const NotEnoughBalanceErrorType = {
  name: 'NotEnoughBalanceError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Balance is not to perform the process',
  errorCode: 3017
}

export const AutoRateIsInvalidErrorType = {
  name: 'AutoRateIsInvalidError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Auto Rate is not in the limit',
  errorCode: 3018
}

export const BetAmountIsNotInLimitErrorType = {
  name: 'BetAmountIsNotInLimitError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Bet Amount is not in the limits',
  errorCode: 3019
}

export const UserNotAbove18YearsErrorType = {
  name: 'UserNotAbove18YearsError',
  statusCode: STATUS_CODES.FORBIDDEN,
  isOperational: true,
  description: 'UserNotAbove18YearsError',
  errorCode: 3020
}

export const SomethingWentWrongErrorType = {
  name: 'SomethingWentWrong',
  statusCode: STATUS_CODES.FORBIDDEN,
  isOperational: true,
  description: 'Something Went Wrong',
  errorCode: 3021
}

export const InvalidCredentialErrorType = {
  name: 'InvalidCredentialError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Please provide valid credentials',
  errorCode: 3022
}

export const InvalidAmountErrorType = {
  name: 'InvalidAmountError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Amount is less than 0',
  errorCode: 3023
}

export const InvalidDebitTransactionErrorType = {
  name: 'InvalidDebitTransactionError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Debit Transaction not found',
  errorCode: 3024
}

export const InvalidTransactionErrorType = {
  name: 'InvalidTransactionError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Transaction already processed',
  errorCode: 3025
}

export const InsufficientFundsErrorType = {
  name: 'InsufficientFundsError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Insufficient funds',
  errorCode: 3026
}

export const BlockedTransactionErrorType = {
  name: 'BlockedTransactionError',
  statusCode: STATUS_CODES.BAD_GATEWAY,
  isOperational: true,
  description: 'Please contact website operator',
  errorCode: 3027
}

export const InvalidOperatorIdErrorType = {
  name: 'InvalidOperatorIdError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Operator Id is invalid',
  errorCode: 3028
}

export const InvalidOperatorResponseErrorType = {
  name: 'InvalidOperatorResponseError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Operator Response Error',
  errorCode: 3029,
  status: 4
}

export const TransactionAlreadyProcessedErrorType = {
  name: 'TransactionAlreadyProcessedError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Transaction already processed',
  errorCode: 3030
}

export const RecordNotFoundErrorType = {
  name: 'RecordNotFoundError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Record not found',
  errorCode: 3031
}

export const InvalidRoundHashErrorType = {
  name: 'InvalidRoundHashError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong Round Hash',
  errorCode: 3032
}

export const InvalidSignatureErrorType = {
  name: 'InvalidSignatureError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Wrong Signature',
  errorCode: 3033
}

export const NoPreviousRoundBetsExistsErrorType = {
  name: 'NoPreviousRoundBetsExistsError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No previous round bets exists in crash game',
  errorCode: 3034
}

export const InvalidDateErrorType = {
  name: 'InvalidDateErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Provided dates are not valid',
  errorCode: 3035
}

export const InvalidDateRangeErrorType = {
  name: 'InvalidDateRangeErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'From date is greater than to date',
  errorCode: 3036
}

export const InvalidGameSettingErrorType = {
  name: 'InvalidGameSettingError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Game Settings Error Type',
  errorCode: 3037
}

export const SelectedBallsErrorType = {
  name: 'SelectedBallsErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid balls selection',
  errorCode: 3038
}

export const SelectedBallsRangeErrorType = {
  name: 'SelectedBallsRangeErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid balls range selection',
  errorCode: 3039
}

export const DuplicateSelectedBallsErrorType = {
  name: 'DuplicateSelectedBallsErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Selected balls contains duplicate values',
  errorCode: 3040
}

export const InvalidDiceNumberErrorType = {
  name: 'InvalidDiceNumberError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid dice number provided',
  errorCode: 3041
}

export const PreviousOpenBetExistErrorType = {
  name: 'PreviousOpenBetExistError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'You already have an open bet',
  errorCode: 3042
}

export const BlackJackGameInsuranceBetAlreadyPlacedErrorType = {
  name: 'BlackJackGameInsuranceBetAlreadyPlacedErrorType',
  statusCode: STATUS_CODES.FORBIDDEN,
  isOperational: true,
  description: 'Insurance Bet Already Placed',
  errorCode: 3043
}

export const BlackJackGameInsuranceBetErrorType = {
  name: 'BlackJackGameInsuranceBetErrorType',
  statusCode: STATUS_CODES.FORBIDDEN,
  isOperational: true,
  description: 'Black Jack Game unable to place insurance bet',
  errorCode: 3044
}

export const BlackJackGameSplitBetAlreadyPlacedErrorType = {
  name: 'BlackJackGameSplitBetAlreadyPlacedErrorType',
  statusCode: STATUS_CODES.FORBIDDEN,
  isOperational: true,
  description: 'Insurance Bet Already Placed',
  errorCode: 3045
}

export const BlackJackPreviousRoundNotCompletedErrorType = {
  name: 'BlackJackPreviousRoundNotCompletedErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Black Jack Game Previous round not completed',
  errorCode: 3046
}

export const BlackJackGameDoubleBetErrorType = {
  name: 'BlackJackGameDoubleBetErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Black Jack Game unable to double the bet',
  errorCode: 3047
}

export const BlackJackGameSplitBetErrorType = {
  name: 'BlackJackGameSplitBetErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Black Jack Game unable to split the bet',
  errorCode: 3048
}

export const BlackJackGameSplitHitErrorType = {
  name: 'BlackJackGameSplitHitErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Black Jack Game unable to draw a card',
  errorCode: 3049
}

export const InvalidTargetMultiplierErrorType = {
  name: 'InvalidTargetMultiplierErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'The target multiplier is not in the range',
  errorCode: 3050
}

export const InvalidDebitOperatorResponseErrorType = {
  name: 'InvalidDebitOperatorResponseError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid Debit Operator Response Error',
  errorCode: 3029,
  status: -1
}

export const InvalidRiskLevelErrorType = {
  name: 'InvalidRiskLevel',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid risk level provided',
  errorCode: 3051
}

export const GameNotActiveErrorType = {
  name: 'GameNotActive',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Game is not Active. Contact your Admin',
  errorCode: 3052
}

export const OperatorGameNotActiveErrorType = {
  name: 'OperatorGameNotActive',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Game is not Activated at Operator End',
  errorCode: 3053
}

export const GameIsUnderMaintenanceModeErrorType = {
  name: 'GameIsUnderMaintenanceMode',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'The Game is under Maintenance Mode',
  errorCode: 3054
}

export const UnfinishedSlotBetExistsErrorType = {
  name: 'UnfinishedSlotBetExistsError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Unfinished game exist for slot game',
  errorCode: 3055
}

export const NoBaseBetExistsErrorType = {
  name: 'NoBaseBetExistsError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'No base bet exist for slot game',
  errorCode: 3056
}

export const InvalidGameIdForSlotGameEngineErrorType = {
  name: 'InvalidGameIdForSlotGameEngineError',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid game id for slot engine',
  errorCode: 3057
}

export const InvalidGameIdErrorType = {
  name: 'InvalidGameIdErrorType',
  statusCode: STATUS_CODES.BAD_REQUEST,
  isOperational: true,
  description: 'Invalid game id',
  errorCode: 3058
}
