import { RequestValidationError } from '@errors/request-validation.error'
import { NextFunction } from 'express'
import { Request, Response } from 'express'
import Joi from 'joi'

export const validation = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body)

      if (error) {
        throw new RequestValidationError(error)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
