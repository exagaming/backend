import { errorTypes } from '@src/utils/constants/error.constants'
import BaseError from './base.error'

export class AuthenticationError extends BaseError {
  constructor (fields = {}) {
    super(errorTypes.AuthenticationErrorType)
    this.fields = fields
  }
}
