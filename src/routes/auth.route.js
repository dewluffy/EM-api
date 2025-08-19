// routes/auth.route.js
import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import { loginSchema, registerSchema, validate } from '../validations/auth.schema.js'
import authenticate from '../middlewares/authenticate.middleware.js'

const router = express.Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
// router.get('/refresh', validate(loginSchema), authController.refresh)

// router.get('/testToken', authenticate, async (req, res, next) => {
//   try {
//     res.status(200).json({msg: 'ok'})
//   } catch (error) {
//     next(error)
//   }
// })

router.get('/me', authenticate, authController.getMe)
router.patch('/me', authenticate, authController.updateMe)

export default router
