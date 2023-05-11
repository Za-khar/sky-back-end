import { RegisterRequestBody, LoginRequestBody, RefreshRequestBody } from '@interfaces/auth.interface'
import Joi from 'joi'

export const registerSchema = Joi.object<RegisterRequestBody>({
  login: Joi.string().min(3).max(16).required(),
  password: Joi.string().min(6).max(18).required(),

  name: Joi.string().min(3).max(50).required(),

  surname: Joi.string().min(3).max(50).required(),

  description: Joi.string().max(255).optional(),
})

export const loginSchema = Joi.object<LoginRequestBody>({
  login: Joi.string().min(3).max(16).required(),
  password: Joi.string().required(),
})

export const refreshSchema = Joi.object<RefreshRequestBody>({
  refreshToken: Joi.string().required(),
})
