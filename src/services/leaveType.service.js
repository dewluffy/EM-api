import prisma from '../config/prisma.config.js'
import createError from '../utils/create-error.util.js'

export const getAllLeaveTypes = async () => {
  try {
    return await prisma.leaveType.findMany({
      include: { LeaveBalance: true, leaves: true }
    })
  } catch (error) {
    console.error('Error fetching leave types:', error)
    createError(500, 'Cannot fetch leave types')
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

// --- จุดแก้ไขสำคัญ ---
export const createLeaveType = async (data) => {
  if (!data || !data.name || !data.maxDays) {
    createError(400, 'LeaveType name and maxDays are required');
  }

  try {
    // ใช้ Transaction เพื่อให้แน่ใจว่าทุกอย่างสำเร็จ หรือล้มเหลวพร้อมกัน
    const newLeaveType = await prisma.$transaction(async (tx) => {
      // 1. สร้าง LeaveType ใหม่
      const leaveType = await tx.leaveType.create({ data });

      // 2. ค้นหาพนักงานทั้งหมดที่มีอยู่
      const allEmployees = await tx.employee.findMany({
        select: { id: true },
      });

      // 3. ถ้ามีพนักงานอยู่, สร้าง LeaveBalance ใหม่ให้ทุกคน
      if (allEmployees.length > 0) {
        const leaveBalanceData = allEmployees.map((employee) => ({
          employeeId: employee.id,
          leaveTypeId: leaveType.id,
          usedDays: 0,
        }));
        await tx.leaveBalance.createMany({
          data: leaveBalanceData,
        });
      }

      return leaveType;
    });
    return newLeaveType;
  } catch (error) {
    console.error('Error creating leave type and balances:', error);
    createError(500, 'Cannot create leave type');
  }
};
// -------------------

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