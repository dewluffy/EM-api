import express from 'express'
import authRoute from './routes/auth.route.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'
import adminRouter from './routes/admin.route.js'
import holidayRouter from './routes/holiday.route.js'
import attendanceRouter from './routes/attendance.route.js'
import leaveRouter from './routes/leave.route.js'
import leaveTypeRouter from './routes/leaveType.route.js'
import { createDailyAttendance } from './scripts/createDailyAttendance.js'
import cors from 'cors'


const app = express()

app.use(cors({
	origin : 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/admin', adminRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/holiday', holidayRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/leave-types', leaveTypeRouter)
app.get('/dev/run-attendance', async (req, res) => {
  await createDailyAttendance()
  res.send('Manual run ok')
})

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
