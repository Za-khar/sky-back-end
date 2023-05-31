import { PaginationQuery } from '@interfaces/common.interface'
import Joi from 'joi'

export const paginationSchema = Joi.object<PaginationQuery>({
  skip: Joi.number().integer().min(0).default(0),
  take: Joi.number().integer().min(0).default(10),
  sortBy: Joi.string().default('createdAt'),
  order: Joi.string().valid('ASC', 'DESC').default('DESC'),
  searchTerm: Joi.string().default(''),
})
