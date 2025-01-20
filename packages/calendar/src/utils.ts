const isSameDay = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (a.getDate() !== b.getDate()) return false
  if (a.getMonth() !== b.getMonth()) return false
  if (a.getFullYear() !== b.getFullYear()) return false
  return true
}

const isSameDayOrBefore = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (isSameDay(a, b)) return true
  if (a.getTime() < b.getTime()) return true
  return false
}

const isSameDayOrAfter = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (isSameDay(a, b)) return true
  if (a.getTime() > b.getTime()) return true
  return false
}

const modifyDate = (
  date: Date,
  modify: { year?: number; month?: number; day?: number },
) => {
  const newYear = date.getFullYear() + (modify.year ?? 0)
  const newMonth = date.getMonth() + (modify.month ?? 0)
  let newDay = date.getDate() + (modify.day ?? 0)
  // Prevent day falling into the next month because the month has fewer days
  if (modify.month !== undefined && modify.month !== 0) {
    newDay = Math.min(new Date(newYear, newMonth + 1, 0).getDate(), newDay)
  }

  return new Date(newYear, newMonth, newDay)
}

const modifyFocusedDay = (
  date: Date,
  modify: { year?: number; month?: number; day?: number },
  disabled: (day: Date) => boolean,
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
  focusedDay: Date,
  month: Date,
  numberOfMonths: number,
) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const lastDay = new Date(
    month.getFullYear(),
    month.getMonth() + numberOfMonths,
    0,
  )
  return (
    focusedDay.getTime() >= firstDay.getTime() &&
    focusedDay.getTime() <= lastDay.getTime()
  )
}

const findAvailableDayInMonth = (
  start: Date,
  disabled: (day: Date) => boolean,
) => {
  const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0)
  const month = start.getMonth()

  let shift = 0
  const maxShift = Math.max(
    start.getDate() - 1,
    lastDayOfMonth.getDate() - start.getDate(),
  )

  while (shift <= maxShift) {
    start.setDate(start.getDate() + shift)
    if (start.getMonth() === month && !disabled(start)) return start
    start.setDate(start.getDate() - shift)
    if (start.getMonth() === month && !disabled(start)) return start
    shift++
  }

  // Couldn't find any available day in the month, fallback to initial start date
  return start
}

export {
  isSameDay,
  isSameDayOrBefore,
  isSameDayOrAfter,
  modifyDate,
  modifyFocusedDay,
  dayIsInMonth,
  findAvailableDayInMonth,
}
