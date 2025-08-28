import prisma from '../config/prisma.config.js'

export const findTodayAttendance = (employeeId, today) => {
  const startOfDay = new Date(today)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)

  return prisma.attendance.findFirst({
    where: {
      employeeId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      }
    }
  })
}


export const createEmptyAttendance = (employeeId, date) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  return prisma.attendance.upsert({
    where: { employeeId_date: { employeeId, date: startOfDay } },
    create: { employeeId, date: startOfDay },
    update: {}, // ไม่อัพเดตอะไร ถ้ามีแล้ว
  })
}

export const updateCheckIn = (id, checkIn, isLate, location) => {
  return prisma.attendance.update({
    where: { id },
    data: { checkIn, isLate, location }
  })
}

export const updateCheckOut = (id, checkOut) => {
  return prisma.attendance.update({
    where: { id },
    data: { checkOut }
  })
}

export const getAttendanceByEmployeeId = (employeeId) => {
  return prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' }
  })
}

export const updateAttendanceById = (id, updates) => {
  return prisma.attendance.update({
    where: { id },
    data: updates
  })
}

export const deleteAttendanceById = (id) => {
  return prisma.attendance.delete({
    where: { id }
  })
}
