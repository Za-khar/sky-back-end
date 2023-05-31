import { CustomError } from './custom.error'

export class AccessDeniedError extends CustomError {
  statusCode = 403

  constructor() {
    super('Access denied')

    Object.setPrototypeOf(this, AccessDeniedError.prototype)
  }

  serializeErrors() {
    return { message: 'Access denied' }
  }
}
