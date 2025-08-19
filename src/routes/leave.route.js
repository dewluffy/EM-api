import express from 'express'
import * as leaveController from '../controllers/leave.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authenticateAdmin from '../middlewares/authenticate-admin.middleware.js'

const router = express.Router()

router.use(authenticate)

// USER + ADMIN
router.get('/', leaveController.getAllLeaves)
router.get('/:id', leaveController.getLeaveById)
router.post('/', leaveController.createLeave)
router.patch('/:id', leaveController.updateLeave)
router.delete('/:id', leaveController.deleteLeave)

// ADMIN ONLY
router.get('/pending', authenticateAdmin, leaveController.getPendingLeaves)
router.get('/rejected', authenticateAdmin, leaveController.getRejectedLeaves)
router.patch('/:id/approve', authenticateAdmin, leaveController.approveLeave)
router.patch('/:id/reject', authenticateAdmin, leaveController.rejectLeave)

export default router