import * as leaveService from '../services/leave.service.js'
import createError from '../utils/create-error.util.js'
import dayjs from 'dayjs'

export async function getAllLeaves(req, res, next) {
  try {
    const leaves = await leaveService.getAllLeaves(req.user)
    res.json({ leaves })
  } catch (err) {
    next(err)
  }
}

export async function getLeaveById(req, res, next) {
  try {
    const id = +req.params.id
    const leave = await leaveService.getLeaveById(id)

    if (!leave) return next(createError(404, 'Leave not found'))

    if (req.user.role !== 'ADMIN' && leave.employeeId !== req.user.id) {
      return next(createError(403, 'Forbidden'))
    }

    res.json({ leave })
  } catch (err) {
    next(err)
  }
}

export async function getPendingLeaves(req, res, next) {
  try {
    const leaves = await leaveService.getLeavesByStatus('pending')
    res.json({ leaves })
  } catch (err) {
    next(err)
  }
}

export async function getRejectedLeaves(req, res, next) {
  try {
    const leaves = await leaveService.getLeavesByStatus('rejected')
    res.json({ leaves })
  } catch (err) {
    next(err)
  }
}

export async function createLeave(req, res, next) {
  try {
    const { leaveTypeId, startDate, endDate, status } = req.body

    const data = {
      leaveTypeId,
      startDate: dayjs(startDate).toDate(),
      endDate: dayjs(endDate).toDate(),
      status: status || 'pending',
      employeeId: req.user.id
    }

    const leave = await leaveService.createLeave(data)
    res.status(201).json({ message: 'Leave requested', leave })
  } catch (err) {
    next(err)
  }
}

export async function updateLeave(req, res, next) {
  try {
    const id = +req.params.id
    const user = req.user
    const data = { ...req.body }

    if (data.startDate) {
      data.startDate = dayjs(data.startDate).toDate()
    }
    if (data.endDate) {
      data.endDate = dayjs(data.endDate).toDate()
    }

    const updated = await leaveService.updateLeave(id, data, user)
    if (!updated) return next(createError(404, 'Leave not found or not permitted'))

    res.json({ message: 'Leave updated', leave: updated })
  } catch (err) {
    next(err)
  }
}

export async function approveLeave(req, res, next) {
  try {
    const id = +req.params.id
    const approverId = req.user.id
    const leave = await leaveService.approveLeave(id, approverId)
    res.json({ message: 'Leave approved', leave })
  } catch (err) {
    next(err)
  }
}

export async function rejectLeave(req, res, next) {
  try {
    const id = +req.params.id
    const approverId = req.user.id

    const updated = await leaveService.rejectLeave(id, approverId)
    if (!updated) {
      return next(createError(404, 'Leave not found or not permitted'))
    }

    res.json({ message: 'Leave rejected', leave: updated })
  } catch (err) {
    next(err)
  }
}

export async function deleteLeave(req, res, next) {
  try {
    const id = +req.params.id
    const user = req.user
    const deleted = await leaveService.deleteLeave(id, user)
    if (!deleted) return next(createError(404, 'Leave not found'))
    res.json({ message: 'Leave deleted' })
  } catch (err) {
    next(err)
  }
}