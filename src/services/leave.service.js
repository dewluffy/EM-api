import prisma from '../config/prisma.config.js'
import dayjs from 'dayjs'

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
  // 2. ใช้ Transaction เพื่อให้แน่ใจว่าทุกอย่างสำเร็จพร้อมกัน
  return prisma.$transaction(async (tx) => {
    // 2.1. ค้นหาใบลาที่ต้องการอนุมัติ
    const leave = await tx.leave.findUnique({
      where: { id },
    });

    // 2.2. คำนวณจำนวนวันที่ลา
    const duration = dayjs(leave.endDate).diff(dayjs(leave.startDate), 'day') + 1;

    // 2.3. อัปเดตตาราง LeaveBalance โดยเพิ่ม usedDays
    await tx.leaveBalance.update({
      where: {
        employeeId_leaveTypeId: {
          employeeId: leave.employeeId,
          leaveTypeId: leave.leaveTypeId,
        },
      },
      data: {
        usedDays: {
          increment: duration,
        },
      },
    });

    // 2.4. อัปเดตสถานะของใบลา
    const updatedLeave = await tx.leave.update({
      where: { id },
      data: { status: 'approved', approvedBy: approverId },
    });

    return updatedLeave;
  });
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

export async function getLeaveBalancesByEmployeeId(employeeId) {
  return prisma.leaveBalance.findMany({
    where: { employeeId },
    include: {
      leaveType: true, // ดึงข้อมูล LeaveType (ที่มี maxDays) มาด้วย
    },
  });
}