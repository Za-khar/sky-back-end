import { CustomError } from './custom.error'

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public error: { message: string }) {
    super('Invalid Request Parameters')
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return { message: this.error.message }
  }
}
