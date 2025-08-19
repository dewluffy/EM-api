import * as holidayService from '../services/holiday.service.js'
import createError from '../utils/create-error.util.js'

export async function getHolidays(req, res, next) {
  try {
    const holidays = await holidayService.getAllHolidays()
    res.json({ holidays })
  } catch (err) {
    next(err)
  }
}

export async function addHoliday(req, res, next) {
  try {
    const { date, title } = req.body
    if (!date || !title) {
      createError(400, 'Date and title are required')
    }

    const newHoliday = await holidayService.createHoliday({
      date: new Date(date),
      title
    })

    res.status(201).json({ message: 'Holiday created', holiday: newHoliday })
  } catch (err) {
    next(err)
  }
}

export async function editHoliday(req, res, next) {
  try {
    const id = +req.params.id
    const { date, title } = req.body

    const existing = await holidayService.getHolidayById(id)
    if (!existing) createError(404, 'Holiday not found')

    const updated = await holidayService.updateHoliday(id, {
      ...(date && { date: new Date(date) }),
      ...(title && { title })
    })

    res.json({ message: 'Updated successfully', holiday: updated })
  } catch (err) {
    next(err)
  }
}

export async function removeHoliday(req, res, next) {
  try {
    const id = +req.params.id
    const existing = await holidayService.getHolidayById(id)
    if (!existing) createError(404, 'Holiday not found')

    await holidayService.deleteHoliday(id)
    res.json({ message: 'Holiday deleted' })
  } catch (err) {
    next(err)
  }
}
