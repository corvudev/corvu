import {
  type Accessor,
  batch,
  type Component,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  type Setter,
  untrack,
} from 'solid-js'
import {
  type Calendar,
  CalendarDate,
  endOfMonth,
  getDayOfWeek,
  getLocalTimeZone,
  now,
  startOfMonth,
  toCalendar,
} from '@internationalized/date'
import {
  createCalendarContext,
  createInternalCalendarContext,
} from '@src/context'
import {
  dayIsInMonth,
  defaultCalendar,
  findAvailableDayInMonth,
  isSameDay,
  isSameDayOrAfter,
  isSameDayOrBefore,
} from '@src/utils'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createOnce from '@corvu/utils/create/once'
import createRegister from '@corvu/utils/create/register'
import type { DateValue } from '@internationalized/date'
import { isFunction } from '@corvu/utils'

export type CalendarRootProps =
  | CalendarRootSingleProps
  | CalendarRootMultipleProps
  | CalendarRootRangeProps

export type CalendarRootSingleProps = {
  /**
   * The mode of the calendar.
   */
  mode: 'single'
  /**
   * The value of the calendar.
   */
  value?: DateValue | null
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: DateValue | null) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `null`
   */
  initialValue?: DateValue | null
  /** @hidden */
  children:
    | JSX.Element
    | ((props: CalendarRootChildrenSingleProps) => JSX.Element)
} & CalendarRootBaseProps

export type CalendarRootMultipleProps = {
  /**
   * The mode of the calendar.
   */
  mode: 'multiple'
  /**
   * The value of the calendar.
   */
  value?: DateValue[]
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: DateValue[]) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `[]`
   */
  initialValue?: DateValue[]
  /**
   * The minimum number of days that have to be selected.
   * @defaultValue `null`
   */
  min?: number | null
  /**
   * The maximum number of days that can be selected.
   * @defaultValue `null`
   */
  max?: number | null
  /** @hidden */
  children:
    | JSX.Element
    | ((props: CalendarRootChildrenMultipleProps) => JSX.Element)
} & CalendarRootBaseProps

export type CalendarRootRangeProps = {
  /**
   * The mode of the calendar.
   */
  mode: 'range'
  /**
   * The value of the calendar.
   */
  value?: { from: DateValue | null; to: DateValue | null }
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: {
    from: DateValue | null
    to: DateValue | null
  }) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `{ from: null, to: null }`
   */
  initialValue?: { from: DateValue | null; to: DateValue | null }
  /**
   * Whether to reset the range selection if a disabled day is included in the range.
   * @defaultValue `false`
   */
  excludeDisabled?: boolean
  /** @hidden */
  children:
    | JSX.Element
    | ((props: CalendarRootChildrenRangeProps) => JSX.Element)
} & CalendarRootBaseProps

export type CalendarRootBaseProps = {
  /**
   * The month to display in the calendar. Is always the first month if multiple months are displayed.
   */
  month?: DateValue
  /**
   * Callback fired when the month changes.
   */
  onMonthChange?: (month: DateValue) => void
  /**
   * The initial month to display in the calendar.
   * @defaultValue `new ZonedDateTime()`
   */
  initialMonth?: DateValue
  /**
   * The day that is currently focused in the calendar grid.
   */
  focusedDay?: DateValue
  /**
   * Callback fired when the focused day changes.
   */
  onFocusedDayChange?: (focusedDay: DateValue) => void
  /**
   * The initial date that should be focused in the calendar grid.
   * @defaultValue `new ZonedDateTime()`
   */
  initialFocusedDay?: DateValue
  /**
   * The first day of the week. (0-6, 0 is Sunday)
   * @defaultValue `1`
   */
  startOfWeek?: number
  /**
   * Whether the value is required. Prevents unselecting the value.
   * @defaultValue `false`
   */
  required?: boolean
  /**
   * Callback to determine if any given day is disabled.
   * @defaultValue `() => false`
   */
  disabled?: (day: DateValue) => boolean
  /**
   * The number of months to display in the calendar.
   * @defaultValue `1`
   */
  numberOfMonths?: number
  /**
   * Whether to disable outside days (Days falling in the previous or next month).
   * @defaultValue `true`
   */
  disableOutsideDays?: boolean
  /**
   * Whether to always display 6 weeks in a month.
   * @defaultValue `false`
   */
  fixedWeeks?: boolean
  /**
   * The text direction of the calendar.
   * @defaultValue `ltr`
   */
  textDirection?: 'ltr' | 'rtl'
  /**
   * The `id` attribute of the calendar label element(s). There can be multiple labels for each month that is being displayed.
   * @defaultValue `createUniqueId()`
   */
  labelIds?: string[]
  /**
   * The `id` of the calendar context. Useful if you have nested calendars and want to create components that belong to a calendar higher up in the tree.
   */
  contextId?: string
  /**
   * The `timeZone` of the calendar
   */
  timeZone?: string
  /**
   * The `locale` of the current user
   */
  locale?: string
  /**
   * The calendar type
   * @defaultValue `GregorianCalendar`
   */
  calendar?: Calendar
}

/** Props that are passed to the Root component children callback. */
export type CalendarRootChildrenProps =
  | CalendarRootChildrenSingleProps
  | CalendarRootChildrenMultipleProps
  | CalendarRootChildrenRangeProps

export type CalendarRootChildrenSingleProps = {
  /** The mode of the calendar. */
  mode: 'single'
  /** The value of the calendar. */
  value: DateValue | null
  /** Setter to change the value of the calendar. */
  setValue: Setter<DateValue | null>
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenMultipleProps = {
  /** The mode of the calendar. */
  mode: 'multiple'
  /** The value of the calendar. */
  value: DateValue[]
  /** Setter to change the value of the calendar. */
  setValue: Setter<DateValue[]>
  /** The minimum number of days that have to be selected. */
  min: number | null
  /** The maximum number of days that can be selected. */
  max: number | null
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenRangeProps = {
  /** The mode of the calendar. */
  mode: 'range'
  /** The value of the calendar. */
  value: { from: DateValue | null; to: DateValue | null }
  /** Setter to change the value of the calendar. */
  setValue: Setter<{ from: DateValue | null; to: DateValue | null }>
  /** Whether to reset the range selection if a disabled day is included in the range. */
  excludeDisabled: boolean
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenBaseProps = {
  /** The month to display in the calendar. Is always the first month if multiple months are displayed. */
  month: DateValue
  /** Setter to change the month to display in the calendar. Automatically adjusts the focusedDay to be within the visible range. */
  setMonth: Setter<DateValue>
  /** The day that is currently focused in the calendar grid. */
  focusedDay: DateValue
  /** Setter to change the focused day in the calendar grid. Automatically adjusts the month to ensure the focused day is visible. */
  setFocusedDay: Setter<DateValue>
  /** The first day of the week. (0-6, 0 is Sunday) */
  startOfWeek: number
  /** Whether the value is required. Prevents unselecting the value. */
  required: boolean
  /** The number of months to display in the calendar. */
  numberOfMonths: number
  /** Whether to disable outside days (Days falling in the previous or next month). */
  disableOutsideDays: boolean
  /** Whether to always display 6 weeks in a month. */
  fixedWeeks: boolean
  /** The text direction of the calendar. */
  textDirection: 'ltr' | 'rtl'
  /** Array of weekdays starting from the first day of the week. */
  weekdays: DateValue[]
  /** Array of the currently displayed months. */
  months: { month: DateValue; weeks: DateValue[][] }[]
  /** Weeks of the current month. Useful if only one month is being rendered. */
  weeks: DateValue[][]
  /** Function to navigate the calendar. */
  navigate: (
    action:
      | `${'prev' | 'next'}-${'month' | 'year'}`
      | ((date: DateValue) => DateValue),
  ) => void
  /** The ref of the currently focused calendar cell trigger. */
  focusedDayRef: HTMLElement | null
  /** The `id` attributes of the calendar label elements. Can be undefined if no `Calendar.Label` is present for the given month index. */
  labelIds: (string | undefined)[]
}

/** Context wrapper for the calendar. Is required for every calendar you create. */
const CalendarRoot: Component<CalendarRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      calendar: props.calendar ?? defaultCalendar,
      initialValue:
        props.mode === 'single'
          ? null
          : props.mode === 'multiple'
            ? []
            : { from: null, to: null },
      initialMonth: toCalendar(
        props.initialFocusedDay ?? now(props.timeZone ?? getLocalTimeZone()),
        props.calendar ?? defaultCalendar,
      ),
      initialFocusedDay: findAvailableDayInMonth(
        toCalendar(
          props.initialMonth ?? now(props.timeZone ?? getLocalTimeZone()),
          props.calendar ?? defaultCalendar,
        ),
        props.disabled ?? (() => true),
      ),
      startOfWeek: 1,
      required: false,
      disabled: () => false,
      numberOfMonths: 1,
      disableOutsideDays: true,
      fixedWeeks: false,
      textDirection: 'ltr' as const,
      labelIds: [],
      min: null as number | null,
      max: null as number | null,
      excludeDisabled: false,
      timeZone: getLocalTimeZone(),
      locale: Intl.NumberFormat().resolvedOptions().locale,
    },
    props,
  )

  const [value, setValue] = createControllableSignal({
    value: () => defaultedProps.value,
    initialValue: defaultedProps.initialValue,
    onChange: props.onValueChange as (
      value:
        | (DateValue | null)
        | DateValue[]
        | { from: DateValue | null; to: DateValue | null },
    ) => void,
  })

  const [month, setMonthInternal] = createControllableSignal({
    value: () =>
      defaultedProps.month &&
      toCalendar(defaultedProps.month, defaultedProps.calendar),
    initialValue: toCalendar(
      defaultedProps.initialFocusedDay,
      defaultedProps.calendar,
    ),
    onChange: defaultedProps.onMonthChange,
  })

  const [focusedDay, setFocusedDayInternal] = createControllableSignal({
    value: () =>
      defaultedProps.focusedDay &&
      toCalendar(defaultedProps.focusedDay, defaultedProps.calendar),
    initialValue: toCalendar(
      defaultedProps.initialFocusedDay,
      defaultedProps.calendar,
    ),
    onChange: defaultedProps.onFocusedDayChange,
  })

  const registerMemo = createMemo<
    [
      Accessor<string | undefined>[],
      (index: number) => void,
      (index: number) => void,
    ]
  >(() => {
    const registers = Array.from(
      { length: defaultedProps.numberOfMonths },
      (_, index) =>
        createRegister({
          value: () => defaultedProps.labelIds[index] ?? createUniqueId(),
        }),
    )

    const labelIds = registers.map((register) => register[0])
    const registerLabelId = (index: number) => {
      registers[index]?.[1]()
    }
    const unregisterLabelId = (index: number) => {
      registers[index]?.[2]()
    }

    return [labelIds, registerLabelId, unregisterLabelId] as const
  })

  const [focusedDayRef, setFocusedDayRef] = createSignal<HTMLElement | null>(
    null,
  )

  const [isFocusing, setIsFocusing] = createSignal(false)

  const setMonth: Setter<DateValue> = (next) => {
    return untrack(() => {
      let nextValue
      if (typeof next === 'function') {
        nextValue = next(month())
      } else {
        nextValue = next
      }
      batch(() => {
        setMonthInternal(nextValue as DateValue)
        if (
          !dayIsInMonth(focusedDay(), nextValue, defaultedProps.numberOfMonths)
        ) {
          setFocusedDayInternal((focusedDay) =>
            findAvailableDayInMonth(
              new CalendarDate(
                defaultedProps.calendar,
                nextValue.year,
                nextValue.month,
                focusedDay.day,
              ),
              defaultedProps.disabled,
            ),
          )
        }
      })
      return nextValue
    })
  }

  const setFocusedDay: Setter<DateValue> = (next) => {
    return untrack(() => {
      let nextValue
      if (typeof next === 'function') {
        nextValue = next(focusedDay())
      } else {
        nextValue = next
      }
      if (defaultedProps.disabled(nextValue)) return
      batch(() => {
        setFocusedDayInternal(nextValue as DateValue)
        if (!dayIsInMonth(nextValue, month(), defaultedProps.numberOfMonths)) {
          const delta =
            (nextValue.year - month().year) * 12 +
            (nextValue.month - month().month)

          const newMonth = new CalendarDate(
            defaultedProps.calendar,
            month().year,
            month().month +
              Math.sign(delta) *
                Math.max(defaultedProps.numberOfMonths, Math.abs(delta)),
            1,
          )
          setMonthInternal(newMonth)
        }
      })
      return nextValue
    })
  }

  const weekdays = () => {
    const startOfWeek = defaultedProps.startOfWeek
    return Array.from({ length: 7 }, (_, i) => {
      const day = ((i + startOfWeek) % 7) + 4
      return new CalendarDate(defaultedProps.calendar, 1970, 1, day)
    })
  }

  const months = () => {
    const months = []
    for (let i = 0; i < defaultedProps.numberOfMonths; i++) {
      months.push({
        month: month().add({ months: i }),
        weeks: weeks(i),
      })
    }
    return months
  }

  const weeks = (monthOffset = 0) => {
    const adjustedMonth = month().add({ months: monthOffset })
    const calendar = []

    const firstDayOfMonth = startOfMonth(adjustedMonth)
    const lastDayOfMonth = endOfMonth(adjustedMonth)

    const prefixedDays =
      (getDayOfWeek(firstDayOfMonth, defaultedProps.locale) -
        defaultedProps.startOfWeek +
        7) %
      7

    const weekCount = defaultedProps.fixedWeeks
      ? 6
      : Math.ceil((lastDayOfMonth.day + prefixedDays) / 7)

    let currentDay = new CalendarDate(
      defaultedProps.calendar,
      adjustedMonth.year,
      adjustedMonth.month,
      1,
    ).subtract({ days: prefixedDays })

    for (let i = 0; i < weekCount; i++) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(currentDay)
        currentDay = currentDay.add({ days: 1 })
      }
      calendar.push(week)
    }

    return calendar
  }

  const navigate = (
    action:
      | `${'prev' | 'next'}-${'month' | 'year'}`
      | ((date: DateValue) => DateValue),
  ) => {
    if (typeof action === 'function') {
      const newDate = action(month())
      setMonth(newDate)
      return
    }
    switch (action) {
      case 'prev-month':
        setMonth((month) => month.subtract({ months: 1 }))
        break
      case 'next-month':
        setMonth((month) => month.add({ months: 1 }))
        break
      case 'prev-year':
        setMonth((month) => month.subtract({ years: 1 }))
        break
      case 'next-year':
        setMonth((month) => month.add({ years: 1 }))
        break
    }
  }

  const onDaySelect = (day: DateValue) => {
    setFocusedDay(day)
    switch (defaultedProps.mode) {
      case 'single':
        setValue((value) => {
          if (
            isSameDay(day, value as DateValue | null) &&
            !defaultedProps.required
          ) {
            return null
          } else {
            return day
          }
        })
        break
      case 'multiple':
        setValue((value) => {
          value = value as DateValue[]
          const isSelected = value.some((d) => isSameDay(day, d))
          if (
            isSelected &&
            value.length !== defaultedProps.min &&
            !(value.length === 1 && defaultedProps.required)
          ) {
            return value.filter((d) => !isSameDay(day, d))
          }
          if (!isSelected && value.length !== defaultedProps.max) {
            return [...value, day]
          }
          return value
        })
        break
      case 'range':
        setValue((value) => {
          value = value as { from: DateValue | null; to: DateValue | null }
          if (value.from === null) {
            return { from: day, to: null }
          }
          if (value.to === null) {
            let from = value.from
            let to = day
            if (day.compare(from) < 0) {
              to = from
              from = day
            }
            if (defaultedProps.excludeDisabled) {
              for (
                let day = from.copy();
                day < to;
                day = day.add({ days: 1 })
              ) {
                if (defaultedProps.disabled(day)) {
                  return { from: day, to: null }
                }
              }
            }
            return { from, to }
          }
          if (isSameDay(day, value.from) && !defaultedProps.required) {
            return { from: null, to: null }
          }
          return { from: day, to: null }
        })
        break
    }
  }

  const isSelected = (day: DateValue) => {
    let _value = value()
    switch (defaultedProps.mode) {
      case 'single':
        return isSameDay(day, _value as DateValue | null)
      case 'multiple':
        return (_value as DateValue[]).some((value) => isSameDay(day, value))
      case 'range':
        _value = _value as { from: DateValue | null; to: DateValue | null }
        return (
          isSameDay(day, _value.from) ||
          (isSameDayOrAfter(day, _value.from) &&
            isSameDayOrBefore(day, _value.to))
        )
    }
  }

  const isDisabled = (day: DateValue, _month?: DateValue) => {
    _month = _month ?? month()
    if (defaultedProps.disableOutsideDays && day.month !== _month.month) {
      return true
    }
    return defaultedProps.disabled(day)
  }

  const childrenProps: CalendarRootChildrenProps = {
    get mode() {
      return defaultedProps.mode
    },
    get value() {
      return value()
    },
    // @ts-expect-error: Union type shenanigans
    setValue,
    get month() {
      return month()
    },
    setMonth,
    get focusedDay() {
      return focusedDay()
    },
    setFocusedDay,
    get startOfWeek() {
      return defaultedProps.startOfWeek
    },
    get required() {
      return defaultedProps.required
    },
    get numberOfMonths() {
      return defaultedProps.numberOfMonths
    },
    get disableOutsideDays() {
      return defaultedProps.disableOutsideDays
    },
    get fixedWeeks() {
      return defaultedProps.fixedWeeks
    },
    get textDirection() {
      return defaultedProps.textDirection
    },
    get weekdays() {
      return weekdays()
    },
    get months() {
      return months()
    },
    get weeks() {
      return weeks()
    },
    navigate,
    get focusedDayRef() {
      return focusedDayRef()
    },
    get min() {
      return defaultedProps.min
    },
    get max() {
      return defaultedProps.max
    },
    get excludeDisabled() {
      return defaultedProps.excludeDisabled
    },
    get labelIds() {
      return registerMemo()[0].map((labelId) => labelId())
    },
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      // @ts-expect-error: Union type shenanigans
      return children(childrenProps)
    }
    return children
  }

  const memoizedCalendarRoot = createMemo(() => {
    const CalendarContext = createCalendarContext(defaultedProps.contextId)
    const InternalCalendarContext = createInternalCalendarContext(
      defaultedProps.contextId,
    )

    return (
      <CalendarContext.Provider
        value={{
          // @ts-expect-error: Union type shenanigans
          mode: () => defaultedProps.mode,
          // @ts-expect-error: Union type shenanigans
          value,
          // @ts-expect-error: Union type shenanigans
          setValue,
          month,
          setMonth,
          focusedDay,
          setFocusedDay,
          startOfWeek: () => defaultedProps.startOfWeek,
          required: () => defaultedProps.required,
          numberOfMonths: () => defaultedProps.numberOfMonths,
          disableOutsideDays: () => defaultedProps.disableOutsideDays,
          fixedWeeks: () => defaultedProps.fixedWeeks,
          textDirection: () => defaultedProps.textDirection,
          weekdays,
          months,
          weeks,
          navigate,
          focusedDayRef,
          min: () => defaultedProps.min,
          max: () => defaultedProps.max,
          excludeDisabled: () => defaultedProps.excludeDisabled,
          labelIds: () => registerMemo()[0],
          timeZone: defaultedProps.timeZone,
          locale: defaultedProps.locale,
          calendar: defaultedProps.calendar,
        }}
      >
        <InternalCalendarContext.Provider
          value={{
            // @ts-expect-error: Union type shenanigans
            mode: () => defaultedProps.mode,
            // @ts-expect-error: Union type shenanigans
            value,
            // @ts-expect-error: Union type shenanigans
            setValue,
            month,
            setMonth,
            focusedDay,
            setFocusedDay,
            startOfWeek: () => defaultedProps.startOfWeek,
            required: () => defaultedProps.required,
            numberOfMonths: () => defaultedProps.numberOfMonths,
            disableOutsideDays: () => defaultedProps.disableOutsideDays,
            fixedWeeks: () => defaultedProps.fixedWeeks,
            textDirection: () => defaultedProps.textDirection,
            weekdays,
            months,
            weeks,
            navigate,
            focusedDayRef,
            min: () => defaultedProps.min,
            max: () => defaultedProps.max,
            excludeDisabled: () => defaultedProps.excludeDisabled,
            labelIds: () => registerMemo()[0],
            registerLabelId: (index: number) => registerMemo()[1](index),
            unregisterLabelId: (index: number) => registerMemo()[2](index),
            onDaySelect,
            isSelected,
            isDisabled,
            isFocusing,
            setIsFocusing,
            disabled: defaultedProps.disabled,
            setFocusedDayRef,
            timeZone: defaultedProps.timeZone,
            locale: defaultedProps.locale,
            calendar: defaultedProps.calendar,
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalCalendarContext.Provider>
      </CalendarContext.Provider>
    )
  })

  return memoizedCalendarRoot as unknown as JSX.Element
}

export default CalendarRoot
