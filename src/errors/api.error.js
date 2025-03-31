import { errorTypes } from '@src/utils/constants/error.constants'
import BaseError from './base.error'

export class APIError extends BaseError {
  constructor ({ name, statusCode = errorTypes.InternalServerErrorType.statusCode, isOperational = errorTypes.InternalServerErrorType.isOperational, description = errorTypes.InternalServerErrorType.description, errorCode = errorTypes.InternalServerErrorType.statusCode }) {
    super({ name, statusCode, isOperational, description, errorCode })
  }
}
