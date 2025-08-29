import * as leaveTypeService from '../services/leaveType.service.js'

// ดึง LeaveType ทั้งหมด
export const getLeaveTypes = async (req, res, next) => {
  try {
    const leaveTypes = await leaveTypeService.getAllLeaveTypes()
    res.status(200).json({ success: true, data: leaveTypes })
  } catch (err) {
    next(err)
  }
}

// ดึง LeaveType ตาม id
export const getLeaveTypeById = async (req, res, next) => {
  try {
    const leaveType = await leaveTypeService.getLeaveTypeById(req.params.id)
    res.status(200).json({ success: true, data: leaveType })
  } catch (err) {
    next(err)
  }
}

// สร้าง LeaveType ใหม่
export const createLeaveType = async (req, res, next) => {
  try {
    const newLeaveType = await leaveTypeService.createLeaveType(req.body)
    res.status(201).json({ success: true, data: newLeaveType })
  } catch (err) {
    next(err)
  }
}

// แก้ไข LeaveType
export const updateLeaveType = async (req, res, next) => {
  try {
    const updatedLeaveType = await leaveTypeService.updateLeaveType(req.params.id, req.body)
    res.status(200).json({ success: true, data: updatedLeaveType })
  } catch (err) {
    next(err)
  }
}

// ลบ LeaveType
export const deleteLeaveType = async (req, res, next) => {
  try {
    const deletedLeaveType = await leaveTypeService.deleteLeaveType(req.params.id)
    res.status(200).json({ success: true, data: deletedLeaveType })
  } catch (err) {
    next(err)
  }
}
