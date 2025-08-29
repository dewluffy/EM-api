import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.util.js'

export const getAllLeaveTypes = async () => {
  try {
    return await prisma.leaveType.findMany({
      include: { LeaveBalance: true, leaves: true }
    })
  } catch (error) {
    console.error('Error fetching leave types:', error)
    createErrorUtil(500, 'Cannot fetch leave types')
  }
}

export const getLeaveTypeById = async (id) => {
  if (!id) createError(400, 'LeaveType id is required')

  const leaveType = await prisma.leaveType.findUnique({
    where: { id: Number(id) },
    include: { LeaveBalance: true, leaves: true }
  })

  if (!leaveType) createError(404, `LeaveType with id ${id} not found`)
  return leaveType
}

export const createLeaveType = async (data) => {
  if (!data || !data.name || !data.maxDays) {
    createError(400, 'LeaveType name and maxDays are required')
  }

  try {
    return await prisma.leaveType.create({ data })
  } catch (error) {
    console.error('Error creating leave type:', error)
    createError(500, 'Cannot create leave type')
  }
}

export const updateLeaveType = async (id, data) => {
  if (!id) createError(400, 'LeaveType id is required')
  if (!data || (!data.name && !data.maxDays)) createError(400, 'Nothing to update')

  try {
    return await prisma.leaveType.update({
      where: { id: Number(id) },
      data
    })
  } catch (error) {
    console.error('Error updating leave type:', error)
    createError(500, `Cannot update LeaveType with id ${id}`)
  }
}

export const deleteLeaveType = async (id) => {
  if (!id) createError(400, 'LeaveType id is required')

  try {
    return await prisma.leaveType.delete({
      where: { id: Number(id) }
    })
  } catch (error) {
    console.error('Error deleting leave type:', error)
    createError(500, `Cannot delete LeaveType with id ${id}`)
  }
}
