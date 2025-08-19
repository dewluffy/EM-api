import prisma from '../config/prisma.config.js'

export const getAllHolidays = () => {
  return prisma.holiday.findMany({ orderBy: { date: 'asc' } })
}

export const createHoliday = (data) => {
  return prisma.holiday.create({ data })
}

export const getHolidayById = (id) => {
  return prisma.holiday.findUnique({ where: { id } })
}

export const updateHoliday = (id, data) => {
  return prisma.holiday.update({ where: { id }, data })
}

export const deleteHoliday = (id) => {
  return prisma.holiday.delete({ where: { id } })
}
