import prisma from '../config/prisma.config.js'

export async function getAllLeaves(user) {
  if (user.role === 'ADMIN') {
    return prisma.leave.findMany({ include: { leaveType: true, employee: true } })
  }
  return prisma.leave.findMany({
    where: { employeeId: user.id },
    include: { leaveType: true }
  })
}

export async function getLeavesByStatus(status) {
  return prisma.leave.findMany({
    where: { status },
    include: { leaveType: true, employee: true }
  })
}

export async function getLeaveById(id) {
  return prisma.leave.findUnique({
    where: { id },
    include: { leaveType: true, employee: true, approver: true }
  })
}

export async function createLeave(data) {
  return prisma.leave.create({ data })
}

export async function updateLeave(id, data, user) {
  const leave = await prisma.leave.findUnique({ where: { id } })
  if (!leave) return null
  if (user.role !== 'ADMIN' && leave.employeeId !== user.id) return null
  return prisma.leave.update({ where: { id }, data })
}

export async function approveLeave(id, approverId) {
  return prisma.leave.update({
    where: { id },
    data: { status: 'approved', approvedBy: approverId }
  })
}

export async function rejectLeave(id, approverId) {
  const leave = await prisma.leave.findUnique({ where: { id } })
  if (!leave) return null

  return await prisma.leave.update({
    where: { id },
    data: {
      status: 'rejected',
      approvedBy: approverId
    }
  })
}

export async function deleteLeave(id, user) {
  const leave = await prisma.leave.findUnique({ where: { id } })
  if (!leave) return null
  if (user.role !== 'ADMIN' && leave.employeeId !== user.id) return null
  return prisma.leave.delete({ where: { id } })
}