import { UserController } from '@controllers/user.controller'
import { validation } from '@middlewares/validation.middleware'
import { updateMyProfileSchema } from '@validators/user.validator'
import { Router } from 'express'

export const userRouter = Router()

userRouter.get('/myProfile', UserController.getMyProfile)

userRouter.put('/myProfile', validation(updateMyProfileSchema), UserController.updateMyProfile)

userRouter.delete('/myProfile', UserController.deleteMyProfile)
