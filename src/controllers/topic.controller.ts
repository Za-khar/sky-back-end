import { CreateTopicRequestBody } from '@interfaces/topic.interface'
import { AppDataSource } from 'app-data-source'
import { Topic } from 'entities/topic.entity'
import { NextFunction, Request, Response } from 'express'
import { RequestValidationError } from '@errors/request-validation.error'
import { PaginationQuery } from '@interfaces/common.interface'

export class TopicController {
  static async getAllTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, take, sortBy, order, searchTerm } = req.query as PaginationQuery

      const queryBuilder = AppDataSource.getRepository(Topic).createQueryBuilder('topic')

      if (searchTerm) {
        queryBuilder.andWhere(`topic.title LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
      }

      const paginationQueryBuilder = queryBuilder.orderBy(`topic.${sortBy}`, order).skip(skip).take(take)

      const topics = await paginationQueryBuilder.getMany()
      const totalCount = await queryBuilder.getCount()

      res.status(200).json({ models: topics, totalCount: totalCount })
    } catch (error) {
      next(error)
    }
  }

  static async createTopic(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body as CreateTopicRequestBody

      const topicRepository = AppDataSource.getRepository(Topic)

      const foundTopic = await topicRepository.findOneBy({ title })

      if (foundTopic) {
        throw new RequestValidationError({ message: `Topic with title '${title}' already exist` })
      }

      const newRopicEntity = topicRepository.create({
        title,
      })

      await topicRepository.save(newRopicEntity)

      res.status(200).json(newRopicEntity)
    } catch (error) {
      next(error)
    }
  }
}
