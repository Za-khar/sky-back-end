import { CustomError } from '@errors/custom.error'
import { NotFoundError } from '@errors/not-found.error'
import { NextFunction, Request, Response } from 'express'

export const handleErrors = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  console.log(error)

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json(error.serializeErrors())
  }

  return res.status(500).json('Internal Server Error')
}

export const handleNotFound = (_req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError())
}
