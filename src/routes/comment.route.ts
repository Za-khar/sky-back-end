import { CommentController } from '@controllers/comment.controller'
import { validation } from '@middlewares/validation.middleware'
import { createCommentSchema, getCommentsSchema } from '@validators/comment.validatior'
import { Router } from 'express'

export const commentRouter = Router()

commentRouter.post('/create', validation(createCommentSchema), CommentController.createComment)
commentRouter.get('/', validation(getCommentsSchema, 'query'), CommentController.getComments)
