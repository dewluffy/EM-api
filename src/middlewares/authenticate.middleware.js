import jwt from 'jsonwebtoken'
import createError from '../utils/create-error.util.js'
import { getEmployeeBy } from '../services/auth.service.js'

export default async function (req, res, next) {
	const authorization = req.headers.authorization 
	if(!authorization || !authorization.startsWith('Bearer')) {
		createError(401, 'Unauthorized!!')
	}
	const token = authorization.split(' ')[1]
	
	if(!token) {
		createError(401, 'Unauthorized!!')
	}
	
	const payload = jwt.verify(token, process.env.JWT_SECRET)
	const foundUser = await getEmployeeBy('id', payload.id)
	if(!foundUser) {
		createError(401, 'Unauthorized!!')
	}
	const {password, createdAt, updatedAt, ...userData} = foundUser
	req.user = userData
	next()
}
