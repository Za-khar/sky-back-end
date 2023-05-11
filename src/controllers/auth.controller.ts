import { AppDataSource } from 'app-data-source'
import { NextFunction, Request, Response } from 'express'
import { User } from 'entities/user.entity'
import bcrypt from 'bcrypt'
import { LoginRequestBody, RefreshRequestBody, RegisterRequestBody } from '@interfaces/auth.interface'
import config from 'config'
import jwt from 'jsonwebtoken'
import { RefreshToken } from 'entities/refreshToken.entity'
import { RequestValidationError } from '@errors/request-validation.error'
import { omit } from 'lodash'

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password, description, name, surname } = req.body as RegisterRequestBody

      const userRepository = AppDataSource.getRepository(User)

      // Check if a user with the same login already exists
      const existingUser = await userRepository.findOneBy({
        login,
      })

      if (existingUser) {
        throw new RequestValidationError({ message: 'Login already in use' })
      }

      // Hash the password and create the new user
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = userRepository.create({
        login,
        password: hashedPassword,
        description,
        name,
        surname,
      })
      await userRepository.save(newUser)

      // Generate a JWT and refresh token
      const accessToken = jwt.sign({ userId: newUser.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      })

      const refreshToken = jwt.sign({ userId: newUser.id }, config.refreshSecret)

      // Save the refresh token
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

      const refreshTokenEntity = refreshTokenRepository.create({
        user: newUser,
        token: refreshToken,
      })

      await refreshTokenRepository.save(refreshTokenEntity)

      const resUser = omit(newUser, 'password')
      // Respond with the new user ID
      res.status(200).json({ ...resUser, accessToken, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body as LoginRequestBody

      // Find the user by login
      const userRepository = AppDataSource.getRepository(User)
      const user = await userRepository.findOneBy({ login })

      if (!user) {
        throw new RequestValidationError({ message: 'Invalid email or password' })
      }

      // Check if the password is correct
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        throw new RequestValidationError({ message: 'Invalid email or password' })
      }

      // Generate a JWT and refresh token
      const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      })

      const refreshToken = jwt.sign({ userId: user.id }, config.refreshSecret)

      // Save the refresh token
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

      const newRefreshToken = refreshTokenRepository.create({
        user,
        token: refreshToken,
      })

      await refreshTokenRepository.save(newRefreshToken)

      const resUser = omit(user, 'password')

      // Respond with the access token and refresh token
      res.status(200).json({ ...resUser, accessToken, refreshToken })
    } catch (error) {
      next(error)
    }
  }

  // Define a middleware function to refresh the access token
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the refresh token from the request body
      const { refreshToken } = req.body as RefreshRequestBody

      if (!refreshToken) {
        throw new RequestValidationError({ message: 'Refresh token missing' })
      }
      // Find the user by refresh token
      const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)

      const tokenEntity = await refreshTokenRepository.findOne({
        where: { token: refreshToken },
        relations: { user: true },
      })

      console.log(tokenEntity)
      if (!tokenEntity) {
        throw new RequestValidationError({ message: 'Refresh token missing' })
      }

      // Geberate refresh token and access token
      const newAccessToken = jwt.sign({ userId: tokenEntity.user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiration,
      })

      const newRefreshToken = jwt.sign({ userId: tokenEntity.user.id }, config.refreshSecret)

      const newTokenEntity = refreshTokenRepository.create({
        token: newRefreshToken,
        user: tokenEntity.user,
      })

      await refreshTokenRepository.save(newTokenEntity)
      await refreshTokenRepository.delete(tokenEntity.id)

      // Respond with the new access token
      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    } catch (error) {
      next(error)
    }
  }
}
