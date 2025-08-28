import * as authService from '../services/auth.service.js'
import createError from '../utils/create-error.util.js'

export async function register(req, res, next) {
  try {
    const result = await authService.registerService(req.body);
    const { firstName, lastName, email } = result;
    res.status(201).json({
      message: "Register successful",
      result: { firstName, lastName, email },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const { accessToken, userData } = await authService.loginService(email, password)

    res.json({
      message: 'Login successful',
      accessToken,
      user: userData
    })
  } catch (err) {
    createError(401, err.message)
  }
}

export async function getMe(req, res) {
  res.json({ user: req.user })
}

export async function updateMe(req, res, next) {
  try {
    const updatedEmployee = await authService.updateMeService(req.user.id, req.body)
    
    const { password, ...safeEmployee } = updatedEmployee

    res.json({
      message: 'Profile updated successfully',
      employee: safeEmployee
    })
  } catch (err) {
    createError(400, err.message)
  }
}
