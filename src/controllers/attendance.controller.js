import createError from '../utils/create-error.util.js'
import * as attendanceService from '../services/attendance.service.js'
import { getThaiNow, getThaiToday } from '../utils/time.util.js'

export async function checkIn(req, res, next) {
  try {
    const employeeId = req.user.id
    const now = getThaiNow()
    const today = getThaiToday()


    const attendance = await attendanceService.findTodayAttendance(employeeId, today)
    if (!attendance) {
      createError(400, 'Attendance record for today not found. Please contact admin.')
    }

    if (attendance.checkIn) {
      createError(400, 'You have already checked in today')
    }

    const checkInTime = now
    const lateThreshold = new Date(today)
    lateThreshold.setHours(9, 0, 0, 0)

    const updated = await attendanceService.updateCheckIn(
      attendance.id,
      checkInTime,
      checkInTime > lateThreshold,
      req.body.location || undefined
    )

    res.json({
      message: 'Checked in successfully',
      attendance: updated
    })
  } catch (err) {
    next(err)
  }
}

export async function checkOut(req, res, next) {
  try {
    const employeeId = req.user.id
    const now = getThaiNow()
    const today = getThaiToday()

    const attendance = await attendanceService.findTodayAttendance(employeeId, today)
    if (!attendance) {
      createError(400, 'Attendance record for today not found. Please contact admin.')
    }

    if (!attendance.checkIn) {
      createError(400, 'Please check in first')
    }

    if (attendance.checkOut) {
      createError(400, 'You have already checked out today')
    }

    const updated = await attendanceService.updateCheckOut(attendance.id, now)

    res.json({
      message: 'Checked out successfully',
      attendance: updated
    })
  } catch (err) {
    next(err)
  }
}

export async function getAttendance(req, res, next) {
  try {
    const employeeId = req.user.id
    const attendance = await attendanceService.getAttendanceById(employeeId)
    res.json({ attendance })
  } catch (err) {
    next(err)
  }
}

export async function getAttendanceByEmployeeId(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      createError(400, 'Invalid employee ID')
    }

    const records = await attendanceService.getAttendanceById(id)

    if (!records || records.length === 0) {
      createError(404, `No attendance records found for employee ID ${id}`)
    }

    res.json({ attendance: records })
  } catch (err) {
    next(err)
  }
}

export async function updateAttendanceById(req, res, next) {
  try {
    const id = +req.params.id

    const existing = await attendanceService.getAttendanceById(id)
    if (!existing) {
      createError(404, `Attendance ID ${id} not found`)
    }

    const allowedFields = ['checkIn', 'checkOut', 'location', 'isLate']

    const updates = {}

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key]
      }
    }

    if (Object.keys(updates).length === 0) {
      createError(400, 'No valid fields to update')
    }

    const updated = await attendanceService.updateAttendanceById(id, updates)

    res.json({
      message: 'Attendance updated successfully',
      attendance: updated
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteAttendanceById(req, res, next) {
  try {
    const id = Number(req.params.id)

    const deleted = await attendanceService.deleteAttendanceById(id)

    if (!deleted) {
      return next(createError(404, `Attendance record ID ${id} not found`))
    }

    res.json({
      message: `Attendance record ID ${id} has been deleted successfully`
    })
  } catch (err) {
    next(err)
  }
}