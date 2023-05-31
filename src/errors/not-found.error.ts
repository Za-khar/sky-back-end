import { CustomError } from './custom.error'

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor(public error: { message: string } | undefined = { message: 'Not Found' }) {
    super(error.message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return { message: this?.error?.message ?? 'Not Found' }
  }
}
