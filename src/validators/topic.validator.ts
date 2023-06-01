import {
  CreateTopicRequestBody,
  GetAllTopicsRequestQuery,
  UpdateMyTopicsRequestBody,
} from '@interfaces/topic.interface'
import Joi from 'joi'
import { paginationSchema } from './common.validator'

export const getAllTopicsSchema = Joi.object<GetAllTopicsRequestQuery>({
  userId: Joi.string().uuid().optional(),
}).concat(paginationSchema)

export const createTopicSchema = Joi.object<CreateTopicRequestBody>({
  title: Joi.string().min(1).max(50).required(),
})

export const updateMyTopicsSchema = Joi.object<UpdateMyTopicsRequestBody>({
  topic: Joi.string().uuid().required(),
  action: Joi.string().valid('save', 'unsave').required(),
})
