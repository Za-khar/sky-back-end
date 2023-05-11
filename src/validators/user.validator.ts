import { UpdateMyProfileRequestBody } from '@interfaces/user.interface'
import Joi from 'joi'

export const updateMyProfileSchema = Joi.object<UpdateMyProfileRequestBody>({
  login: Joi.string().min(3).max(16).optional(),

  password: Joi.string().min(6).max(18).optional(),

  name: Joi.string().min(3).max(50).optional(),

  surname: Joi.string().min(3).max(50).optional(),

  description: Joi.string().max(255).optional(),

  oldPassword: Joi.string().min(6).max(18).optional(),
})
