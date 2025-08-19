import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const TH_TIMEZONE = 'Asia/Bangkok'

export function getThaiToday() {
  return dayjs().tz(TH_TIMEZONE).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  // return dayjs().tz(TH_TIMEZONE).startOf('day').format('DD-MM-YYYY')
}

export function getThaiNow() {
  return  dayjs().tz(TH_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
}