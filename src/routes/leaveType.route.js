import express from 'express'
import * as leaveTypeController from '../controllers/leaveType.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authenticateAdmin from '../middlewares/authenticate-admin.middleware.js'

const router = express.Router()

router.use(authenticate) // ทุก route ต้อง login

// USER + ADMIN
router.get('/', authenticate,  leaveTypeController.getLeaveTypes)
router.get('/:id', authenticate, leaveTypeController.getLeaveTypeById)

// ADMIN ONLY
router.post('/', authenticateAdmin, leaveTypeController.createLeaveType)
router.put('/:id', authenticateAdmin, leaveTypeController.updateLeaveType)
router.delete('/:id', authenticateAdmin, leaveTypeController.deleteLeaveType)

export default router
