import {
  type Accessor,
  type Context,
  createContext,
  type Setter,
  useContext,
} from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'

export type CalendarContextValue<
  Mode extends 'single' | 'multiple' | 'range' =
    | 'single'
    | 'multiple'
    | 'range',
> = Mode extends 'single'
  ? CalendarContextSingleValue
  : Mode extends 'multiple'
    ? CalendarContextMultipleValue
    : Mode extends 'range'
      ? CalendarContextRangeValue
      :
          | CalendarContextSingleValue
          | CalendarContextMultipleValue
          | CalendarContextRangeValue

export type CalendarContextSingleValue = {
  /** The mode of the calendar. */
  mode: Accessor<'single'>
  /** The value of the calendar. */
  value: Accessor<Date | null>
  /** Setter to change the value of the calendar. */
  setValue: Setter<Date | null>
} & CalendarContextBaseValue

export type CalendarContextMultipleValue = {
  /** The mode of the calendar. */
  mode: Accessor<'multiple'>
  /** The value of the calendar. */
  value: Accessor<Date[]>
  /** Setter to change the value of the calendar. */
  setValue: Setter<Date[]>
} & CalendarContextBaseValue

export type CalendarContextRangeValue = {
  /** The mode of the calendar. */
  mode: Accessor<'range'>
  /** The value of the calendar. */
  value: Accessor<{ from: Date | null; to: Date | null }>
  /** Setter to change the value of the calendar. */
  setValue: Setter<{ from: Date | null; to: Date | null }>
  /** The minimum number of days that have to be selected. */
  min: Accessor<number | null>
  /** The maximum number of days that can be selected. */
  max: Accessor<number | null>
  /** Whether to reset the range selection if a disabled day is included in the range. */
  excludeDisabled: Accessor<boolean>
} & CalendarContextBaseValue

export type CalendarContextBaseValue = {
  /** The month to display in the calendar. Is always the first month if multiple months are displayed. */
  month: Accessor<Date>
  /** Setter to change the month to display in the calendar. Automatically adjusts the focusedDate to be within the visible range. */
  setMonth: Setter<Date>
  /** The date that is currently focused in the calendar grid. */
  focusedDate: Accessor<Date>
  /** Setter to change the focused date in the calendar grid. Automatically adjusts the month to ensure the focused date is visible. */
  setFocusedDate: Setter<Date>
  /** The first day of the week. (0-6, 0 is Sunday) */
  startOfWeek: Accessor<number>
  /** Whether the value is required. Prevents unselecting the value. */
  required: Accessor<boolean>
  /** The number of months to display in the calendar. */
  numberOfMonths: Accessor<number>
  /** Whether to disable outside days (Days falling in the previous or next month). */
  disableOutsideDays: Accessor<boolean>
  /** Whether to always display 6 weeks in a month. */
  fixedWeeks: Accessor<boolean>
  /** The text direction of the calendar. */
  textDirection: Accessor<'ltr' | 'rtl'>
  /** Array of weekdays starting from the first day of the week. */
  weekdays: Accessor<Date[]>
  /** Array of the currently displayed months. */
  months: Accessor<{ month: Date; weeks: Date[][] }[]>
  /** Function to get the weeks of a given month. */
  weeks: (monthOffset?: number) => { month: Date; weeks: Date[][] }
  /** Function to navigate the calendar. */
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
export const useCalendarContext = <
  Mode extends 'single' | 'multiple' | 'range' =
    | 'single'
    | 'multiple'
    | 'range',
>(
  contextId?: string,
) => {
  if (contextId === undefined) {
    const context = useContext(
      CalendarContext as Context<CalendarContextValue<Mode> | undefined>,
    )
    if (!context) {
      throw new Error(
        '[corvu]: Calendar context not found. Make sure to wrap Calendar components in <Calendar.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<CalendarContextValue<Mode> | undefined>(
    `calendar-${contextId}`,
  )
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
  isDisabled: (date: Date, month?: Date) => boolean
  isFocusing: Accessor<boolean>
  setIsFocusing: Setter<boolean>
  disabled: (day: Date) => boolean
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
