import { object, string, ref } from 'yup'
import createError from '../utils/create-error.util.js'

export const loginSchema = object({
  email: string()
    .trim()
    .email('Email must be a valid email address')
    .required('Email is required'),
  password: string()
    .trim()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
}).noUnknown()

export const registerSchema = object({
  firstName: string()
    .trim()
    .required('First name is required'),
  lastName: string()
    .trim()
    .required('Last name is required'),
  email: string()
    .trim()
    .email('Email must be a valid email address')
    .required('Email is required'),
  password: string()
    .trim()
    .min(4, 'Password must be at least 4 characters')
    .required('Password is required'),
  confirmPassword: string()
    .oneOf([ref('password')], 'Confirm password must match password')
    .required('Confirm password is required'),
}).noUnknown()

export const validate = (schema, options = {}) => {
  return async function (req, res, next) {
    try {
      const cleanBody = await schema.validate(req.body, { abortEarly: false, ...options })
      req.body = cleanBody
      next()
    } catch (err) {
      const errMsg = err.errors.join(' ||| ')
      console.log(errMsg)
      return next(createError(400, errMsg))
    }
  }
}
