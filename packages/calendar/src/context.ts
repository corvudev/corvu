import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'
import type { DateValue } from '@src/Root'

export type CalendarContextValue = {
  mode: Accessor<'single' | 'multiple' | 'range'>
  value: Accessor<DateValue>
  setValue: Setter<DateValue>
  month: Accessor<Date>
  setMonth: Setter<Date>
  focusedDate: Accessor<Date>
  setFocusedDate: Setter<Date>
  view: Accessor<'day' | 'month' | 'year'>
  setView: Setter<'day' | 'month' | 'year'>
  required: Accessor<boolean>
  startOfWeek: Accessor<number>
  disableOutsideDays: Accessor<boolean>
  fixedWeeks: Accessor<boolean>
  min: Accessor<number | null>
  max: Accessor<number | null>
  weekdays: Accessor<Date[]>
  weeks: Accessor<Date[][]>
  navigate: (
    action: `${'prev' | 'next'}-${'month' | 'year'}` | ((date: Date) => Date),
  ) => void
  /** The `id` attribute of the calendar label element. Is undefined if no `Calendar.Label` is present. */
  labelId: Accessor<string | undefined>
}

const CalendarContext = createContext<CalendarContextValue>()

export const createCalendarContext = (contextId?: string) => {
  if (contextId === undefined) return CalendarContext

  const context = createKeyedContext<CalendarContextValue>(
    `calendar-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the calendar. Optionally provide a contextId to access a keyed context. */
export const useCalendarContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(CalendarContext)
    if (!context) {
      throw new Error(
        '[corvu]: Calendar context not found. Make sure to wrap Calendar components in <Calendar.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<CalendarContextValue>(`calendar-${contextId}`)
  if (!context) {
    throw new Error(
      `[corvu]: Calendar context with id "${contextId}" not found. Make sure to wrap Calendar components in <Calendar.Root contextId="${contextId}">`,
    )
  }
  return context
}

type InternalCalendarContextValue = CalendarContextValue & {
  registerLabelId: () => void
  unregisterLabelId: () => void
  onDaySelect: (day: Date) => void
  isSelected: (date: Date) => boolean
  isDisabled: (date: Date) => boolean
  isFocusing: Accessor<boolean>
  setIsFocusing: Setter<boolean>
}

const InternalCalendarContext = createContext<InternalCalendarContextValue>()

export const createInternalCalendarContext = (contextId?: string) => {
  if (contextId === undefined) return InternalCalendarContext

  const context = createKeyedContext<InternalCalendarContextValue>(
    `calendar-internal-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the calendar. Optionally provide a contextId to access a keyed context. */
export const useInternalCalendarContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalCalendarContext)
    if (!context) {
      throw new Error(
        '[corvu]: Calendar context not found. Make sure to wrap Calendar components in <Calendar.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalCalendarContextValue>(
    `calendar-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Calendar context with id "${contextId}" not found. Make sure to wrap Calendar components in <Calendar.Root contextId="${contextId}">`,
    )
  }
  return context
}
