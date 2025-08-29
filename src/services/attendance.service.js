import prisma from '../config/prisma.config.js'
import { getThaiToday } from "../utils/time.util.js";

// ✅ หาวันนี้ของ employee
export const findTodayAttendance = (employeeId, today = getThaiToday()) => {
  return prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: today, // YYYY-MM-DD string
      },
    },
  });
};


// ✅ สร้าง empty attendance ของวันนี้
export const createEmptyAttendance = (employeeId, today = getThaiToday()) => {
  return prisma.attendance.create({
    data: {
      employeeId,
      date: today, // YYYY-MM-DD
      checkIn: null,
      checkOut: null,
      isLate: false,
      location: null,
    },
  });
};

// ✅ update check-in
export const updateCheckIn = (id, checkIn, isLate, location) => {
  return prisma.attendance.update({
    where: { id },
    data: { checkIn, isLate, location },
  });
};

// ✅ update check-out
export const updateCheckOut = (id, checkOut, location) => {
  return prisma.attendance.update({
    where: { id },
    data: { checkOut, location },
  });
};

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
