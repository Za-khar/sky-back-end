import { TopicController } from '@controllers/topic.controller'
import { authenticate, authorizeUser } from '@middlewares/auth.middleware'
import { validation } from '@middlewares/validation.middleware'
import { paginationSchema } from '@validators/common.validator'
import { createTopicSchema } from '@validators/topic.validator'
import { Router } from 'express'

export const topicRouter = Router()

topicRouter.get('/all', validation(paginationSchema, 'query'), TopicController.getAllTopics)

topicRouter.post('/create', authenticate, authorizeUser, validation(createTopicSchema), TopicController.createTopic)
