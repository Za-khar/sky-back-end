import { UserController } from '@controllers/user.controller'
import { uploadPhotoMiddleware } from '@middlewares/upload.middleware'
import { validation } from '@middlewares/validation.middleware'
import { getUserByIdSchema, updateMyProfileSchema } from '@validators/user.validator'
import { Router } from 'express'

export const userRouter = Router()

userRouter.get('/myProfile', UserController.getMyProfile)

userRouter.put(
  '/myProfile',
  validation(updateMyProfileSchema),
  uploadPhotoMiddleware('avatar', 'avatars'),
  UserController.updateMyProfile,
)

userRouter.delete('/myProfile', UserController.deleteMyProfile)

userRouter.get('/:userId', validation(getUserByIdSchema, 'params'), UserController.getUserById)
