import { TopicController } from '@controllers/topic.controller'
import { authenticate, authorizeUser } from '@middlewares/auth.middleware'
import { validation } from '@middlewares/validation.middleware'
import { createTopicSchema, getAllTopicsSchema, updateMyTopicsSchema } from '@validators/topic.validator'
import { Router } from 'express'

export const topicRouter = Router()

topicRouter.get('/all', validation(getAllTopicsSchema, 'query'), TopicController.getAllTopics)

topicRouter.post('/create', authenticate, authorizeUser, validation(createTopicSchema), TopicController.createTopic)

topicRouter.post(
  '/update/my',
  authenticate,
  authorizeUser,
  validation(updateMyTopicsSchema),
  TopicController.updateMyTopics,
)
