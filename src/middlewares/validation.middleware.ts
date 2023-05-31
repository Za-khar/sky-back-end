import { RequestValidationError } from '@errors/request-validation.error'
import { NextFunction } from 'express'
import { Request, Response } from 'express'
import Joi from 'joi'

export const validation = (schema: Joi.ObjectSchema, entity: 'body' | 'query' | 'params' | undefined = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, value } = schema.validate(req[entity])

      if (error) {
        throw new RequestValidationError(error)
      }

      req[entity] = value

      next()
    } catch (error) {
      next(error)
    }
  }
}
