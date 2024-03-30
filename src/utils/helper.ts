import { GenericItem } from '../types/common'

export function generateDaysInMonth(
  month: number = 1,
  year: number = new Date().getFullYear()
): GenericItem[] {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  let daysInMonth = 31

  if (month === 2) {
    daysInMonth = isLeapYear ? 29 : 28
  } else if ([4, 6, 9, 11].includes(month)) {
    daysInMonth = 30
  }

  const daysArray: GenericItem[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = day.toString().padStart(2, '0')
    const dayObject: GenericItem = {
      name: dayString,
      value: day
    }
    daysArray.push(dayObject)
  }

  return daysArray
}

export function generateMonthsArray(): GenericItem[] {
  const numbersArray: GenericItem[] = []

  for (let i = 1; i <= 12; i++) {
    const numberObject: GenericItem = {
      name: i.toString(),
      value: i.toString()
    }
    numbersArray.push(numberObject)
  }

  return numbersArray
}

export function generateYearsArray(): GenericItem[] {
  const currentYear = new Date().getFullYear()
  const startYear = 1900
  const yearsArray: GenericItem[] = []

  for (let year = currentYear; year >= startYear; year--) {
    const yearObject: GenericItem = {
      name: year.toString(),
      value: year.toString()
    }
    yearsArray.push(yearObject)
  }

  return yearsArray
}

export function getCurrentMonthYear() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-indexed, so add 1
  const year = now.getFullYear()
  return `${month}/${year}`
}

export const getMonthName = date => {
  const monthNumber = parseInt(date.split('/')[0])
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  return months[monthNumber - 1]
}
