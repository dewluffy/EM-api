import prisma from '../config/prisma.config.js'

export async function getAllEmployees() {
  const employees = await prisma.employee.findMany({
    orderBy: { firstName: 'desc' }
  })
  return employees.map(({ password, ...rest }) => rest)
}

export async function getEmployeeById(id) {
  const employee = await prisma.employee.findUnique({ where: { id } })
  if (!employee) return null
  const { password, ...safeEmployee } = employee
  return safeEmployee
}

export async function updateEmployeeById(id, updates) {
  const updatableFields = [
    'firstName',
    'lastName',
    'mobile',
    'position',
    'department',
    'profileImage',
    'coverImage'
  ]

  const dataToUpdate = updatableFields.reduce((acc, key) => {
    if (updates[key]) {
      acc[key] = updates[key].trim()
    }
    return acc
  }, {})

  if (Object.keys(dataToUpdate).length === 0) {
    return { error: 'No valid data to update' }
  }

  const updated = await prisma.employee.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      mobile: true,
      position: true,
      department: true,
      profileImage: true,
      coverImage: true,
      role: true,
      startDate: true,
      updatedAt: true
    }
  })

  return updated
}

export async function deleteEmployeeById(id) {
  return prisma.employee.delete({ where: { id } })
}

export async function employeeExists(id) {
  const employee = await prisma.employee.findUnique({ where: { id } })
  return !!employee
}