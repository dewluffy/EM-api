import * as authService from '../services/auth.service.js'
import createError from '../utils/create-error.util.js'

export async function register(req, res, next) {
  try {
    const result = await authService.registerService(req.body)
    const { firstName, lastName, email } = result
    res.json({ message: 'Register successful', result:{firstName, lastName, email} })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const { accessToken, userData } = await authService.loginService(email, password)

    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   sameSite: 'strict',
    //   secure: true,
    //   maxAge: 60 * 24 * 60 * 60 * 1000
    // })

    res.json({
      message: 'Login successful',
      accessToken,
      user: userData
    })
  } catch (err) {
    next(createError(401, err.message))
  }
}

// export async function refresh(req, res, next) {
//   try {
//     const oldToken = req.cookies.refreshToken
//     console.log(oldToken)
//     if (!oldToken) {
//       return next(createError(401, 'No refresh token'))
//     }
//     let payload
//     try {
//       payload = jwt.verify(oldToken, process.env.REFRESH_SECRET)
//     } catch (err) {
//       return next(createError(401, 'Invalid refresh token'))
//     }

//     const oldRefresh = await Prisma.refreshToken.findFirst({
//       where: {
//         token: oldToken
//       }
//     })

//     if (!oldRefresh) {
//       createError(401, err.message)
//     }

//     const foundUser = await Prisma.employee.findUnique({
//       where: { id: payload.id }
//     })

//     if (!foundUser) {
//       return next(createError(404, 'User not found'))
//     }

//     const newRefreshToken = jwt.sign(
//       { id: foundUser.id },
//       process.env.REFRESH_SECRET,
//       { expiresIn: '1d' }
//     )

//     await Prisma.refreshToken.update({
//       where: { id: oldRefresh.id },
//       data: { token: newRefreshToken }
//     })

//       const newAccessToken = jwt.sign(
//         { id: foundUser.id },
//         process.env.JWT_SECRET,
//         { expiresIn: '20s' }
//     )

//    res.status(200).json({
//       accessToken: newAccessToken
//     })
//   } catch (error) {
//     next(error)
//   }
// }

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
    next(createError(400, err.message))
  }
}
