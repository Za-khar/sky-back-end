import { AuthController } from '@controllers/auth.controller'
import { validation } from '@middlewares/validation.middleware'
import { loginSchema, refreshSchema, registerSchema } from '@validators/auth.validator'
import { Router } from 'express'

export const authRouter = Router()

authRouter.post('/login', validation(loginSchema), AuthController.login)

authRouter.post('/register', validation(registerSchema), AuthController.register)

authRouter.post('/refresh-token', validation(refreshSchema), AuthController.refresh)
