import { RequestValidationError } from '@errors/request-validation.error'
import { UpdateMyProfileRequestBody } from '@interfaces/user.interface'
import { AppDataSource } from 'app-data-source'
import { User } from 'entities/user.entity'
import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import bcrypt from 'bcrypt'
import { NotFoundError } from '@errors/not-found.error'
import { unlinkPhoto } from '@utils/unlink.util'

export class UserController {
  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.user

      const userDataRes = omit(userData, 'password')

      res.status(200).json(userDataRes)
    } catch (error) {
      next(error)
    }
  }

  static async deleteMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.user

      const userRepository = AppDataSource.getRepository(User)

      await userRepository.delete(userData.id)

      unlinkPhoto(userData.avatar, 'avatars')

      res.status(200).json({ status: 'ok' })
    } catch (error) {
      next(error)
    }
  }

  static async updateMyProfile(req: Request, res: Response, next: NextFunction) {
    const avatar = req?.file?.filename
    const oldAvatar = req?.user?.avatar

    try {
      const userData = req.user
      const { login, password, name, surname, description, oldPassword } = req.body as UpdateMyProfileRequestBody

      const userRepository = AppDataSource.getRepository(User)

      if (login && login !== userData.login) {
        const foundUserEntity = await userRepository.findOneBy({ login })

        if (foundUserEntity) {
          throw new RequestValidationError({ message: 'Login already in use' })
        }
        userData.login = login
      }

      if (password) {
        if (!oldPassword) {
          throw new RequestValidationError({ message: 'Must enter old password' })
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(oldPassword, userData.password)

        if (!passwordMatch) {
          throw new RequestValidationError({ message: 'Invalid old password' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        userData.password = hashedPassword
      }

      userData.avatar = avatar || oldAvatar
      userData.name = name || userData.name
      userData.surname = surname || userData.surname
      userData.description = description || userData.description

      await userRepository.save(userData)

      unlinkPhoto(oldAvatar, 'avatars')

      const userDataRes = omit(userData, 'password')

      res.status(200).json(userDataRes)
    } catch (error) {
      unlinkPhoto(avatar, 'avatars')
      next(error)
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      const foundUser = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId })
        .getOne()

      if (!foundUser) {
        throw new NotFoundError({ message: 'User not found' })
      }

      const resUserData = omit(foundUser, 'password')

      res.status(200).json(resUserData)
    } catch (error) {
      next(error)
    }
  }
}
