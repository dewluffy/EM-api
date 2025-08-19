import express from 'express'
import * as attendanceController from '../controllers/attendance.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authenticateAdmin from '../middlewares/authenticate-admin.middleware.js'

const router = express.Router()

router.post('/checkin', authenticate, attendanceController.checkIn)
router.post('/checkout', authenticate, attendanceController.checkOut)
router.get('/me', authenticate, attendanceController.getAttendance)
router.get('/admin/:id', authenticateAdmin, attendanceController.getAttendanceByEmployeeId)
router.patch('/admin/:id', authenticateAdmin, attendanceController.updateAttendanceById)
router.delete('/admin/:id', authenticateAdmin, attendanceController.deleteAttendanceById)

export default router
