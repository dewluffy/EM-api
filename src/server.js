import dotenv from 'dotenv'
import app from './app.js'
import cron from 'node-cron'
import { createDailyAttendance } from './scripts/createDailyAttendance.js';

dotenv.config()

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))

cron.schedule('0 17 * * *', async () => {
  console.log('Running daily attendance at 05:00 AM (TH time)...')
  try {
    await createDailyAttendance()
    console.log('Attendance created successfully')
  } catch (err) {
    console.error('Error in cron job:', err.message)
  }
})

