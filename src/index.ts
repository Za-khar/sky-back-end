import config from './config'
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { handleErrors, handleNotFound } from '@middlewares/error.middleware'
import 'reflect-metadata'
import { AppDataSource } from 'app-data-source'
import { authenticate, authorizeUser } from '@middlewares/auth.middleware'
import { authRouter } from '@routes/auth.router'
import { userRouter } from '@routes/user.router'
import { topicRouter } from '@routes/topic.router'
import { articleRouter } from '@routes/article.router'
import { commentRouter } from '@routes/comment.route'

const app: Application = express()

// Parse JSON request bodies
app.use(express.json())

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))

// Handle errors

app.use('/auth', authRouter)
app.use('/topic', topicRouter)

app.use(authenticate)
app.use(authorizeUser)

app.use('/user', userRouter)
app.use('/article', articleRouter)
app.use('/comment', commentRouter)

app.use(handleNotFound)
app.use(handleErrors)

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')

    app.listen(config.port, () => {
      console.log(`Server running at http://${config.host}:${config.port}`)
    })
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })
