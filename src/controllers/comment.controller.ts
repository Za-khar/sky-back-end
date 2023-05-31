import { NextFunction, Request, Response } from 'express'
import { CreateCommentRequestBody, GetCommentsRequestQuery } from '@interfaces/comment.interface'
import { AppDataSource } from 'app-data-source'
import { Comment } from 'entities/comment.entity'
import { Article } from 'entities/article.entity'
import { NotFoundError } from '@errors/not-found.error'
import { omit } from 'lodash'

export class CommentController {
  static async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId, content } = req.body as CreateCommentRequestBody
      const user = req.user

      const articleRepository = AppDataSource.getRepository(Article)

      const foundArticle = await articleRepository.findOneBy({
        id: articleId,
      })

      if (!foundArticle) {
        throw new NotFoundError({ message: 'Article not found' })
      }

      const commentRepository = AppDataSource.getRepository(Comment)

      const newCommentEntity = commentRepository.create({
        content,
        article: foundArticle,
        user: omit(user, 'password'),
      })

      await commentRepository.save(newCommentEntity)

      res.status(200).json(newCommentEntity)
    } catch (error) {
      next(error)
    }
  }

  static async getComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId, skip, take, sortBy, order } = req.query as GetCommentsRequestQuery

      const queryBuilder = AppDataSource.getRepository(Comment)
        .createQueryBuilder('comment')
        .select(['comment', 'user.id', 'user.name', 'user.surname', 'user.avatar', 'article'])
        .leftJoin('comment.user', 'user')
        .leftJoin('comment.article', 'article')
        .where('article.id = :articleId', { articleId })

      const paginationQueryBuilder = queryBuilder.orderBy(`comment.${sortBy}`, order).skip(skip).take(take)

      const articles = await paginationQueryBuilder.getMany()

      const totalCount = await queryBuilder.getCount()

      res.status(200).json({ models: articles, totalCount: totalCount })
    } catch (error) {
      next(error)
    }
  }
}
