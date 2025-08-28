import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.util.js'

export async function registerService(data) {
  const { email, firstName, lastName, password } = data

  const emailTrimmed = email.trim()

  const foundUser = await prisma.employee.findUnique({
    where: { email: emailTrimmed }
  })

  if (foundUser) {
    createError(409, `Email ${emailTrimmed} is already registered`)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = {
    email: emailTrimmed,
    password: hashedPassword,
    firstName: firstName,
    lastName: lastName
  }

  return await prisma.employee.create({ data: newUser })
}

export async function loginService(email, password) {
  const emailTrimmed = email.trim().toLowerCase()

  const foundUser = await prisma.employee.findUnique({
    where: { email: emailTrimmed }
  })

  if (!foundUser) {
    createError(401, 'Invalid email or password')
  }

  const pwOk = await bcrypt.compare(password, foundUser.password)
  if (!pwOk) {
    createError(401, 'Invalid email or password')
  }

  const accessToken = jwt.sign(
    { id: foundUser.id },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '2d' }
  )

  const { password: pw, createdAt, updatedAt, ...userData } = foundUser

  return { accessToken, userData }
}

export const getEmployeeBy = async (column, value) => {
	return await prisma.employee.findUnique({
		where : { [column] : value}
	})
}

export async function updateMeService(userId, updates) {
  const updatableFields = [
    'firstName',
    'lastName',
    'mobile',
    'position',
    'department',
    'profileImage',
    'coverImage'
  ]

  const dataToUpdate = updatableFields.reduce((acc, key) => {
    if (updates[key]) {
      acc[key] = updates[key].trim()
    }
    return acc
  }, {})

  if (Object.keys(dataToUpdate).length === 0) {
    createError(400, 'No data to update')
  }

  return await prisma.employee.update({
    where: { id: userId },
    data: dataToUpdate
  })
}
