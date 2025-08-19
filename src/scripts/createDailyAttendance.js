import prisma from '../config/prisma.config.js'
import { getThaiToday } from '../utils/time.util.js'

export async function createDailyAttendance() {
  // const today = getThaiToday()
  const today = new Date(Date.now())

  console.log(today)

  const isHoliday = await prisma.holiday.findFirst({
    where: { date: today }
  })
  if (isHoliday) {
    return console.log('Today is a holiday. Skipping attendance creation.')
  }

  const employees = await prisma.employee.findMany({
    where: { role: 'USER' },
    select: { id: true }
  })

  let createdCount = 0

  for (const employee of employees) {
    const exists = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: today
      }
    })

    if (!exists) {
      await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: today
        }
      })
      createdCount++
    }
  }

  console.log(`Daily attendance created for ${createdCount} employees`)
}
