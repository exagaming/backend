import { UserController } from '@src/rest-resources/controllers/user.controller'
import { authenticationMiddleWare } from '@src/rest-resources/middlewares/authentication.middleware'
import { checkGameStatusMiddleware } from '@src/rest-resources/middlewares/checkGameStatus.middleware'
import requestValidationMiddleware from '@src/rest-resources/middlewares/requestValidation.middleware'
import responseValidationMiddleware from '@src/rest-resources/middlewares/responseValidation.middleware'
import { v1Schema } from '@src/schema'
import express from 'express'

const userRoutes = express.Router()
const userSchema = v1Schema.userSchema

userRoutes.get('/user-detail',
  authenticationMiddleWare,
  UserController.getUserDetail,
  responseValidationMiddleware(userSchema.userDetailSchema)
)

userRoutes.post('/login',
  checkGameStatusMiddleware,
  requestValidationMiddleware(userSchema.loginSchema),
  UserController.login,
  responseValidationMiddleware(userSchema.loginSchema)
)

userRoutes.post('/update-profile',
  authenticationMiddleWare,
  requestValidationMiddleware(userSchema.updateProfileSchema),
  UserController.updateProfile,
  responseValidationMiddleware(userSchema.updateProfileSchema)
)

userRoutes.post('/game-close',
  authenticationMiddleWare,
  UserController.gameClose,
  responseValidationMiddleware()
)

userRoutes.post('/generate-server-seed',
  authenticationMiddleWare,
  UserController.generateServerSeed,
  responseValidationMiddleware(userSchema.generateServerSeedSchema)
)

export { userRoutes }
