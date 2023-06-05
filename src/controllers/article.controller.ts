import { RateArticleRequestBody } from './../interfaces/article.interface'
import { AccessDeniedError } from '@errors/access-denied.error'
import { NotFoundError } from '@errors/not-found.error'
import { RequestValidationError } from '@errors/request-validation.error'
import { CreateArticleRequestBody, GetArticlesFilterQuery } from '@interfaces/article.interface'
import { AppDataSource } from 'app-data-source'
import { Article } from 'entities/article.entity'
import { ArticleLike } from 'entities/articleLike.entity'
import { Topic } from 'entities/topic.entity'
import { User } from 'entities/user.entity'
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

export class ArticleController {
  static async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.user
      const { title, text, topics } = req.body as CreateArticleRequestBody

      // Get topics from database
      const topicRepository = AppDataSource.getRepository(Topic)

      const foundTopics = await topicRepository
        .createQueryBuilder('topic')
        .where('topic.id IN (:...topicIds)', { topicIds: topics })
        .getMany()

      if (foundTopics.length !== topics.length) {
        throw new RequestValidationError({ message: 'Invalid topics' })
      }

      const articleRepository = AppDataSource.getRepository(Article)

      const newArtileEntity = articleRepository.create({
        title,
        text,
        topics: foundTopics,
        user: {
          id: userData.id,
          name: userData.name,
          surname: userData.surname,
          avatar: userData.avatar,
        },
      })

      await articleRepository.save(newArtileEntity)

      res.status(200).json(newArtileEntity)
    } catch (error) {
      next(error)
    }
  }

  static async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.user
      const { articleId } = req.params

      const articleRepository = AppDataSource.getRepository(Article)

      const foundArticle = await articleRepository.findOne({
        where: {
          id: articleId,
        },
        relations: ['user'],
      })

      if (!foundArticle) {
        throw new NotFoundError({ message: 'Article not found' })
      }

      if (foundArticle?.user?.id !== userData.id) {
        throw new AccessDeniedError()
      }

      await articleRepository.delete(foundArticle.id)

      const { user, ...resArticleData } = foundArticle

      res.status(200).json({ ...resArticleData, userId: user.id })
    } catch (error) {
      next(error)
    }
  }

  static async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, take, sortBy, order, searchTerm, userId, topicId } = req.query as GetArticlesFilterQuery

      const queryBuilder = AppDataSource.getRepository(Article)
        .createQueryBuilder('article')
        .select(['article', 'user.id', 'user.name', 'user.surname', 'user.avatar', 'topic'])
        .leftJoin('article.user', 'user')
        .leftJoin('article.topics', 'topic')
        .leftJoin('article.articleLikes', 'articleLike')
        .loadRelationCountAndMap('article.likesCount', 'article.articleLikes')

      if (searchTerm) {
        queryBuilder.andWhere(`article.title LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
      }

      if (userId) {
        queryBuilder.andWhere(`article.user.id = :userId`, { userId })
      }

      if (topicId) {
        queryBuilder.andWhere(`topic.id = :topicId`, { topicId })
      }

      const paginationQueryBuilder = queryBuilder.orderBy(`article.${sortBy}`, order).skip(skip).take(take)

      const articles = await paginationQueryBuilder.getMany()

      const totalCount = await queryBuilder.getCount()

      res.status(200).json({ models: articles, totalCount: totalCount })
    } catch (error) {
      next(error)
    }
  }

  static async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId } = req.params
      const userData = req.user

      const foundArticle = await AppDataSource.getRepository(Article)
        .createQueryBuilder('article')
        .select(['article', 'user.id', 'user.name', 'user.surname', 'user.avatar', 'topic'])
        .leftJoin('article.user', 'user')
        .leftJoin('article.topics', 'topic')
        .leftJoinAndSelect('article.articleLikes', 'articleLike')
        .loadRelationCountAndMap('article.likesCount', 'article.articleLikes')
        .where('article.id = :articleId', { articleId })
        .getOne()

      if (!foundArticle) {
        throw new NotFoundError({ message: 'Article not found' })
      }

      const formattedLikes = foundArticle?.articleLikes?.map((val) => val.id)

      let liked = false

      if (formattedLikes?.length) {
        const articleLikes = await AppDataSource.getRepository(ArticleLike)
          .createQueryBuilder('articleLike')
          .leftJoinAndSelect('articleLike.user', 'user')
          .where('articleLike.id IN (:...ids)', { ids: formattedLikes })
          .getMany()

        liked = !!articleLikes.some((val) => val.user.id === userData.id)
      }

      res.status(200).json({ ..._.omit(foundArticle, 'articleLikes'), liked })
    } catch (error) {
      next(error)
    }
  }

  static async rateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId, isLiked } = req.body as RateArticleRequestBody

      const articleLikeRepository = AppDataSource.getRepository(ArticleLike)
      const articleRepository = AppDataSource.getRepository(Article)

      const articleEntity = await articleRepository.findOneBy({ id: articleId })

      if (!articleEntity) {
        throw new NotFoundError({ message: 'Article not found' })
      }

      const user = req.user as User

      const articleLikeEntity = await articleLikeRepository
        .createQueryBuilder('articleLike')
        .leftJoinAndSelect('articleLike.article', 'article')
        .leftJoinAndSelect('articleLike.user', 'user')
        .where('article.id = :articleId', { articleId })
        .andWhere('user.id = :userId', { userId: user.id })
        .getOne()

      if (isLiked && !articleLikeEntity) {
        const newArticleLike = new ArticleLike()

        newArticleLike.user = user

        newArticleLike.article = articleEntity

        await articleLikeRepository.save(newArticleLike)
      }

      if (!isLiked && articleLikeEntity) {
        await articleLikeRepository.delete(articleLikeEntity.id)
      }

      res.status(200).json({ status: 'ok' })
    } catch (error) {
      next(error)
    }
  }
}
