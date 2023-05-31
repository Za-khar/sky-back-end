import { CreateCommentRequestBody, GetCommentsRequestQuery } from '@interfaces/comment.interface'
import Joi from 'joi'
import { paginationSchema } from './common.validator'

export const createCommentSchema = Joi.object<CreateCommentRequestBody>({
  articleId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(500).required(),
})

export const getCommentsSchema = Joi.object<GetCommentsRequestQuery>({
  articleId: Joi.string().uuid().required(),
}).concat(paginationSchema)
