import {
  type Calendar,
  type DateValue,
  endOfMonth,
  GregorianCalendar,
  isEqualDay,
  isToday,
  startOfMonth,
} from '@internationalized/date'

const isSameDay = (a: DateValue | null, b: DateValue | null) => {
  if (!a || !b) return false
  return isEqualDay(a, b)
}

const isSameDayOrBefore = (a: DateValue | null, b: DateValue | null) => {
  if (!a || !b) return false
  return a.compare(b) <= 0
}

const isSameDayOrAfter = (a: DateValue | null, b: DateValue | null) => {
  if (!a || !b) return false
  return a.compare(b) >= 0
}

const modifyDate = (
  date: DateValue,
  modify: { year?: number; month?: number; day?: number },
) => {
  return date.add({
    days: modify.day,
    years: modify.year,
    months: modify.month,
  })
}

const modifyFocusedDay = (
  date: DateValue,
  modify: { year?: number; month?: number; day?: number },
  disabled: (day: DateValue) => boolean,
  retry = true,
  iteration = 0,
) => {
  if (iteration > 365) return null

  const newDate = modifyDate(date, modify)
  if (!disabled(newDate)) return newDate

  if (!retry) return null

  return modifyFocusedDay(newDate, modify, disabled, retry, iteration + 1)
}

const dayIsInMonth = (
  focusedDay: DateValue,
  month: DateValue,
  numberOfMonths: number,
) => {
  const firstDay = startOfMonth(month)
  const lastDay = firstDay.add({ months: numberOfMonths })

  const isAfterOrEquerToFirst = focusedDay.compare(firstDay) >= 0
  const isBeforeOrEquerToLast = focusedDay.compare(lastDay) <= 0

  return isAfterOrEquerToFirst && isBeforeOrEquerToLast
}

const findAvailableDayInMonth = (
  start: DateValue,
  disabled: (day: DateValue) => boolean,
) => {
  const lastDayOfMonth = endOfMonth(start)
  const month = start.month

  let shift = 0
  const maxShift = Math.max(start.day - 1, lastDayOfMonth.day - start.day)

  while (shift <= maxShift) {
    start.add({ days: shift })
    if (start.month === month && !disabled(start)) return start
    start.subtract({ days: shift })
    if (start.month === month && !disabled(start)) return start
    shift++
  }

  // Couldn't find any available day in the month, fallback to initial start date
  return start
}

const defaultCalendar = new GregorianCalendar() as Calendar

export {
  isSameDay,
  isSameDayOrBefore,
  isSameDayOrAfter,
  modifyDate,
  modifyFocusedDay,
  dayIsInMonth,
  findAvailableDayInMonth,
  isToday,
  defaultCalendar,
}
