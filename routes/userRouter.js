import { Router } from "express"
import { userController } from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import checkOnBlockMiddleware from "../middleware/checkOnBlockMiddleware.js"

const userRouter = new Router()

userRouter.post('/registration', userController.registration)
userRouter.post('/login', userController.login)
userRouter.get('/auth', authMiddleware, checkOnBlockMiddleware, userController.check)
userRouter.get('/data', userController.getAll)
userRouter.get('/block', checkOnBlockMiddleware, userController.block)
userRouter.get('/unblock', checkOnBlockMiddleware, userController.unblock)
userRouter.delete('/delete', checkOnBlockMiddleware, userController.delete)

export { userRouter }
