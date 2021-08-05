import express from 'express'

import authController from '../controllers/auth'
import validation from '../middlewares/express-validator'

const authRouter = express.Router()

authRouter.route('/sign-up')
  .post(validation.signUp, authController.signUp)

authRouter.route('/login')
  .post(validation.login, authController.login)


export default authRouter
