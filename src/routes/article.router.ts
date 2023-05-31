import { ArticleController } from '@controllers/article.controller'
import { validation } from '@middlewares/validation.middleware'
import {
  createArticleSchema,
  deleteArticleSchema,
  getArticleByIdSchema,
  getArticlesFilterSchema,
  rateArticleSchema,
} from '@validators/article.validatior'
import { Router } from 'express'

export const articleRouter = Router()

articleRouter.post('/create', validation(createArticleSchema), ArticleController.createArticle)
articleRouter.delete('/:articleId', validation(deleteArticleSchema, 'params'), ArticleController.deleteArticle)
articleRouter.get('/all', validation(getArticlesFilterSchema, 'query'), ArticleController.getArticles)
articleRouter.get('/:articleId', validation(getArticleByIdSchema, 'params'), ArticleController.getArticleById)
articleRouter.post('/rate', validation(rateArticleSchema), ArticleController.rateArticle)
