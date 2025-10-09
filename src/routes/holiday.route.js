import express from 'express'
import * as holidayController from '../controllers/holiday.controller.js'
import authenticate from '../middlewares/authenticate.middleware.js'
import authenticateAdmin from '../middlewares/authenticate-admin.middleware.js'

const router = express.Router()


router.get('/', authenticate , holidayController.getHolidays)
router.post('/', authenticateAdmin , holidayController.addHoliday)
router.patch('/:id', authenticateAdmin , holidayController.editHoliday)
router.delete('/:id', authenticateAdmin , holidayController.removeHoliday)

export default router
