import { NextFunction, Request, Response } from 'express'
import config from 'config'
import jwt from 'jsonwebtoken'
import { AppDataSource } from 'app-data-source'
import { User } from 'entities/user.entity'
import { NotAuthorizedError } from '@errors/not-authorized.error'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the authorization header and extract the JWT
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      throw new NotAuthorizedError()
    }

    // Verify the JWT and extract the user ID
    const { userId } = jwt.verify(token, config.jwtSecret) as { userId: string }
    req.userId = userId

    // Call the next middleware function
    next()
  } catch {
    next(new NotAuthorizedError())
  }
}

export async function authorizeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req?.userId

    // Check if the user ID is valid
    if (!userId) {
      throw new NotAuthorizedError()
    }

    // Load the user from the database
    const userRepository = AppDataSource.getRepository(User)
    const user = await userRepository.findOneBy({ id: userId })

    // Check if the user exists
    if (!user) {
      throw new NotAuthorizedError()
    }

    // Add the user object to the request object
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
