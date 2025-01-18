const isSameDay = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (a.getDate() !== b.getDate()) return false
  if (a.getMonth() !== b.getMonth()) return false
  if (a.getFullYear() !== b.getFullYear()) return false
  return true
}

const isSameDayOrBefore = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (a.getFullYear() > b.getFullYear()) return false
  if (a.getFullYear() === b.getFullYear() && a.getMonth() > b.getMonth())
    return false
  if (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() > b.getDate()
  )
    return false
  return true
}

const isSameDayOrAfter = (a: Date | null, b: Date | null) => {
  if (!a || !b) return false
  if (a.getFullYear() < b.getFullYear()) return false
  if (a.getFullYear() === b.getFullYear() && a.getMonth() < b.getMonth())
    return false
  if (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() < b.getDate()
  )
    return false
  return true
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

const dateIsInRange = (
  focusedDate: Date,
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
    focusedDate.getTime() >= firstDay.getTime() &&
    focusedDate.getTime() <= lastDay.getTime()
  )
}

export {
  isSameDay,
  isSameDayOrBefore,
  isSameDayOrAfter,
  modifyDate,
  dateIsInRange,
}
