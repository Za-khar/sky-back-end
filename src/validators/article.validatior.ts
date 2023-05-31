import {
  CreateArticleRequestBody,
  DeleteArticleRequestParams,
  GetArticleByIdRequestParams,
  GetArticlesFilterQuery,
  RateArticleRequestBody,
} from '@interfaces/article.interface'
import Joi from 'joi'
import { paginationSchema } from './common.validator'

export const createArticleSchema = Joi.object<CreateArticleRequestBody>({
  title: Joi.string().min(1).max(50).required(),
  text: Joi.string().min(1).max(1000).required(),
  topics: Joi.array().items(Joi.string().uuid()).min(1).max(10).required(),
})

export const deleteArticleSchema = Joi.object<DeleteArticleRequestParams>({
  articleId: Joi.string().uuid().required(),
})

export const getArticlesFilterSchema = Joi.object<GetArticlesFilterQuery>({
  userId: Joi.string().uuid().optional(),
  topicId: Joi.string().uuid().optional(),
}).concat(paginationSchema)

export const getArticleByIdSchema = Joi.object<GetArticleByIdRequestParams>({
  articleId: Joi.string().uuid().required(),
})

export const rateArticleSchema = Joi.object<RateArticleRequestBody>({
  articleId: Joi.string().uuid().required(),
  isLiked: Joi.boolean().required(),
})
