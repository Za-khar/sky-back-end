import {
  CreateTopicRequestBody,
  GetAllTopicsRequestQuery,
  UpdateMyTopicsRequestBody,
} from '@interfaces/topic.interface'
import { AppDataSource } from 'app-data-source'
import { Topic } from 'entities/topic.entity'
import { NextFunction, Request, Response } from 'express'
import { RequestValidationError } from '@errors/request-validation.error'
import { User } from 'entities/user.entity'
import _ from 'lodash'

export class TopicController {
  static async getAllTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, take, sortBy, order, searchTerm, userId } = req.query as GetAllTopicsRequestQuery
      const userData = req.user

      const queryBuilder = AppDataSource.getRepository(Topic)
        .createQueryBuilder('topic')
        .leftJoinAndSelect('topic.users', 'user')

      if (userId) {
        queryBuilder.andWhere(`user.id = :userId`, { userId })
      }

      if (searchTerm) {
        queryBuilder.andWhere(`topic.title LIKE :searchTerm`, { searchTerm: `%${searchTerm}%` })
      }

      const paginationQueryBuilder = queryBuilder.orderBy(`topic.${sortBy}`, order).skip(skip).take(take)

      const topics = await paginationQueryBuilder.getMany()
      const totalCount = await queryBuilder.getCount()

      const formattedTopics = topics.map((topic) => ({
        ..._.omit(topic, 'users'),
        selected: topic.users.some((user) => user.id === userData.id),
      }))

      res.status(200).json({ models: formattedTopics, totalCount: totalCount })
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

  static async updateMyTopics(req: Request, res: Response, next: NextFunction) {
    try {
      const { topic, action } = req.body as UpdateMyTopicsRequestBody
      const userData = req.user

      // Get topics from database
      const topicRepository = AppDataSource.getRepository(Topic)

      const foundTopic = await topicRepository
        .createQueryBuilder('topic')
        .where('topic.id = :topicId', { topicId: topic })
        .getOne()

      if (!foundTopic) {
        throw new RequestValidationError({ message: 'Invalid topic' })
      }

      const userTopics = await AppDataSource.getRepository(Topic)
        .createQueryBuilder('topic')
        .leftJoin('topic.users', 'user')
        .andWhere(`user.id = :userId`, { userId: userData.id })
        .getMany()

      const userRepository = AppDataSource.getRepository(User)

      const existInUserTopics = userTopics.find((topic) => topic.id === foundTopic.id)

      const updatedUserTopics =
        action === 'save'
          ? !existInUserTopics
            ? [...userTopics, foundTopic]
            : userTopics
          : userTopics.filter((topic) => topic.id !== foundTopic.id)

      await userRepository.save({ ...userData, topics: updatedUserTopics })

      res.status(200).json({ ...foundTopic, selected: action === 'save' })
    } catch (error) {
      next(error)
    }
  }
}
