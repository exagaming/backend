import { SocketRequestInputValidationErrorType } from '@src/libs/errorTypes'
import BaseError from './base.error'

export class SocketRequestInputValidationError extends BaseError {
  constructor (fields = {}) {
    super(SocketRequestInputValidationErrorType)
    this.fields = fields
  }
}
