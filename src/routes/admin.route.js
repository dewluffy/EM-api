import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import authenticateAdmin from '../middlewares/authenticate-admin.middleware.js'

const router = express.Router()

router.get('/users', authenticateAdmin, adminController.getAllEmployees)
router.get('/users/:id', authenticateAdmin, adminController.getEmployeeById)
router.patch('/users/:id', authenticateAdmin, adminController.updateEmployeeById)
router.delete('/users/:id', authenticateAdmin, adminController.deleteEmployeeById)

export default router
