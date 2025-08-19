import jwt from 'jsonwebtoken'
import createError from '../utils/create-error.util.js'
import { getEmployeeById } from '../services/admin.service.js'

export default async function (req, res, next) {
  try {
    const authorization = req.headers.authorization 
    if (!authorization || !authorization.startsWith('Bearer ')) {
      createError(401, 'Unauthorized!!')
    }

    const token = authorization.split(' ')[1]
    if (!token) {
      createError(401, 'Unauthorized!!')
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const foundUser = await getEmployeeById(payload.id)
    if (!foundUser) {
      createError(401, 'User not found')
    }

    if (foundUser.role !== 'ADMIN') {
      createError(403, 'Forbidden: Admins only')
    }

    const { password, createdAt, updatedAt, ...userData } = foundUser
    req.user = userData
    next()
  } catch (err) {
    next(err)
  }
}
