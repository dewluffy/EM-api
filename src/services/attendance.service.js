import prisma from '../config/prisma.config.js'

export const findTodayAttendance = (employeeId, today) => {
  return prisma.attendance.findFirst({
    where: { employeeId, date: today }
  })
}

export const createEmptyAttendance = (employeeId, date) => {
  return prisma.attendance.create({
    data: { employeeId, date }
  })
}

export const updateCheckIn = (id, checkIn, isLate, location) => {
  return prisma.attendance.update({
    where: { id },
    data: {
      checkIn,
      isLate,
      location
    }
  })
}

export const updateCheckOut = (id, checkOut) => {
  return prisma.attendance.update({
    where: { id },
    data: { checkOut }
  })
}

export const getAttendanceById = async (employeeId) => {
  return await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' }
  })
}

export async function updateAttendanceById(id, updates) {
  const attendance = await prisma.attendance.findUnique({ where: { id } })
  if (!attendance) return null

  return await prisma.attendance.update({
    where: { id },
    data: updates
  })
}

export async function deleteAttendanceById(id) {
  const attendance = await prisma.attendance.findUnique({ where: { id } })
  if (!attendance) return null

  return await prisma.attendance.delete({
    where: { id }
  })
}