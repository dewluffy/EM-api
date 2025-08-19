import createError from '../utils/create-error.util.js'
import * as adminService from '../services/admin.service.js'

export async function getAllEmployees(req, res, next) {
  try {
    const employees = await adminService.getAllEmployees()
    res.json({ employees })
  } catch (err) {
    next(err)
  }
}

export async function getEmployeeById(req, res, next) {
  try {
    const id = +req.params.id
    const employee = await adminService.getEmployeeById(id)
    if (!employee) {
      createError(404, `Employee with ID ${id} not found`)
    }
    res.json({ employee })
  } catch (err) {
    next(err)
  }
}

export async function updateEmployeeById(req, res, next) {
  try {
    const id = Number(req.params.id)

    const existing = await adminService.employeeExists(id)
    if (!existing) {
      createError(404, `Employee with ID ${id} not found`)
    }

    if ('role' in req.body || 'password' in req.body || 'email' in req.body) {
      createError(403, 'Not allowed to update role, email, or password via this endpoint')
    }

    const result = await adminService.updateEmployeeById(id, req.body)

    if (result?.error) {
      createError(400, result.error)
    }

    res.json({
      message: 'Employee updated successfully',
      employee: result
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteEmployeeById(req, res, next) {
  try {
    const id = +req.params.id

    const existing = await adminService.employeeExists(id)
    if (!existing) {
      createError(404, `Employee with ID ${id} not found`)
    }

    await adminService.deleteEmployeeById(id)

    res.json({
      message: `Employee ID ${id} has been deleted successfully`
    })
  } catch (err) {
    next(err)
  }
}
