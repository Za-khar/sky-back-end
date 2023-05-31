import { CreateTopicRequestBody } from '@interfaces/topic.interface'
import Joi from 'joi'

export const createTopicSchema = Joi.object<CreateTopicRequestBody>({
  title: Joi.string().min(1).max(50).required(),
})
