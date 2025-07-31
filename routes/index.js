import { Router } from 'express'
import { userRouter } from './userRouter.js'

const router = new Router()

router.use('/users', userRouter)

export default router
