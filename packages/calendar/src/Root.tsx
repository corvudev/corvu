import {
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
  createCalendarContext,
  createInternalCalendarContext,
} from '@src/context'
import {
  dateIsInRange,
  findAvailableDayInMonth,
  isSameDay,
  isSameDayOrAfter,
  isSameDayOrBefore,
  modifyMonth,
} from '@src/utils'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createOnce from '@corvu/utils/create/once'
import createRegister from '@corvu/utils/create/register'
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
  value?: Date | null
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: Date | null) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `null`
   */
  initialValue?: Date | null
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
  value?: Date[]
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: Date[]) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `[]`
   */
  initialValue?: Date[]
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
  value?: { from: Date | null; to: Date | null }
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: { from: Date | null; to: Date | null }) => void
  /**
   * The initial value of the calendar.
   * @defaultValue `{ from: null, to: null }`
   */
  initialValue?: { from: Date | null; to: Date | null }
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
  month?: Date
  /**
   * Callback fired when the month changes.
   */
  onMonthChange?: (month: Date) => void
  /**
   * The initial month to display in the calendar.
   * @defaultValue `new Date()`
   */
  initialMonth?: Date
  /**
   * The date that is currently focused in the calendar grid.
   */
  focusedDate?: Date
  /**
   * Callback fired when the focused date changes.
   */
  onFocusedDateChange?: (focusedDate: Date) => void
  /**
   * The initial date that should be focused in the calendar grid.
   * @defaultValue `new Date()`
   */
  initialFocusedDate?: Date
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
  disabled?: (day: Date) => boolean
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
   * The `id` attribute of the calendar label element.
   * @defaultValue `createUniqueId()`
   */
  labelId?: string
  /**
   * The `id` of the calendar context. Useful if you have nested calendars and want to create components that belong to a calendar higher up in the tree.
   */
  contextId?: string
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
  value: Date | null
  /** Setter to change the value of the calendar. */
  setValue: Setter<Date | null>
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenMultipleProps = {
  /** The mode of the calendar. */
  mode: 'multiple'
  /** The value of the calendar. */
  value: Date[]
  /** Setter to change the value of the calendar. */
  setValue: Setter<Date[]>
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenRangeProps = {
  /** The mode of the calendar. */
  mode: 'range'
  /** The value of the calendar. */
  value: { from: Date | null; to: Date | null }
  /** Setter to change the value of the calendar. */
  setValue: Setter<{ from: Date | null; to: Date | null }>
  /** The minimum number of days that have to be selected. */
  min: number | null
  /** The maximum number of days that can be selected. */
  max: number | null
  /** Whether to reset the range selection if a disabled day is included in the range. */
  excludeDisabled: boolean
} & CalendarRootChildrenBaseProps

export type CalendarRootChildrenBaseProps = {
  /** The month to display in the calendar. Is always the first month if multiple months are displayed. */
  month: Date
  /** Setter to change the month to display in the calendar. Automatically adjusts the focusedDate to be within the visible range. */
  setMonth: Setter<Date>
  /** The date that is currently focused in the calendar grid. */
  focusedDate: Date
  /** Setter to change the focused date in the calendar grid. Automatically adjusts the month to ensure the focused date is visible. */
  setFocusedDate: Setter<Date>
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
  weekdays: Date[]
  /** Array of the currently displayed months. */
  months: { month: Date; weeks: Date[][] }[]
  /** Function to get the weeks of a given month. */
  weeks: (monthOffset?: number) => { month: Date; weeks: Date[][] }
  /** Function to navigate the calendar. */
  navigate: (
    action: `${'prev' | 'next'}-${'month' | 'year'}` | ((date: Date) => Date),
  ) => void
  /** The `id` attribute of the calendar label element. Is undefined if no `Calendar.Label` is present. */
  labelId: string | undefined
}

/** Context wrapper for the calendar. Is required for every calendar you create. */
const CalendarRoot: Component<CalendarRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      initialValue:
        props.mode === 'single'
          ? null
          : props.mode === 'multiple'
            ? []
            : { from: null, to: null },
      initialMonth: new Date(),
      initialFocusedDate: findAvailableDayInMonth(
        new Date(),
        props.disabled ?? (() => true),
      ),
      startOfWeek: 1,
      required: false,
      disabled: () => false,
      numberOfMonths: 1,
      disableOutsideDays: true,
      fixedWeeks: false,
      textDirection: 'ltr' as const,
      min: null as number | null,
      max: null as number | null,
      excludeDisabled: false,
    },
    props,
  )

  const [value, setValue] = createControllableSignal({
    value: () => defaultedProps.value,
    initialValue: defaultedProps.initialValue,
    onChange: props.onValueChange as (
      value: (Date | null) | Date[] | { from: Date | null; to: Date | null },
    ) => void,
  })

  const [month, setMonthInternal] = createControllableSignal({
    value: () => defaultedProps.month,
    initialValue: defaultedProps.initialMonth,
    onChange: defaultedProps.onMonthChange,
  })

  const [focusedDate, setFocusedDateInternal] = createControllableSignal({
    value: () => defaultedProps.focusedDate,
    initialValue: defaultedProps.initialFocusedDate,
    onChange: defaultedProps.onFocusedDateChange,
  })

  const [labelId, registerLabelId, unregisterLabelId] = createRegister({
    value: () => defaultedProps.labelId ?? createUniqueId(),
  })

  const [isFocusing, setIsFocusing] = createSignal(false)

  const setMonth: Setter<Date> = (next) => {
    return untrack(() => {
      let nextValue
      if (typeof next === 'function') {
        nextValue = next(month())
      } else {
        nextValue = next
      }
      batch(() => {
        setMonthInternal(nextValue as Date)
        if (
          !dateIsInRange(
            focusedDate(),
            nextValue,
            defaultedProps.numberOfMonths,
          )
        ) {
          setFocusedDateInternal((focusedDate) =>
            findAvailableDayInMonth(
              new Date(
                nextValue.getFullYear(),
                nextValue.getMonth(),
                focusedDate.getDate(),
              ),
              defaultedProps.disabled,
            ),
          )
        }
      })
      return nextValue
    })
  }

  const setFocusedDate: Setter<Date> = (next) => {
    return untrack(() => {
      let nextValue
      if (typeof next === 'function') {
        nextValue = next(focusedDate())
      } else {
        nextValue = next
      }
      if (defaultedProps.disabled(nextValue)) return
      batch(() => {
        setFocusedDateInternal(nextValue as Date)
        if (!dateIsInRange(nextValue, month(), defaultedProps.numberOfMonths)) {
          const newMonth = new Date(
            month().getFullYear(),
            month().getMonth() +
              defaultedProps.numberOfMonths * (nextValue < month() ? -1 : 1),
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
      return new Date(1970, 0, day)
    })
  }

  const months = () => {
    const months = []
    for (let i = 0; i < defaultedProps.numberOfMonths; i++) {
      months.push(weeks(i))
    }
    return months
  }

  const weeks = (monthOffset = 0) => {
    const adjustedMonth = new Date(
      month().getFullYear(),
      month().getMonth() + monthOffset,
    )
    const calendar = []

    const firstDayOfMonth = new Date(
      adjustedMonth.getFullYear(),
      adjustedMonth.getMonth(),
      1,
    )
    const lastDayOfMonth = new Date(
      adjustedMonth.getFullYear(),
      adjustedMonth.getMonth() + 1,
      0,
    )
    const prefixedDays =
      (firstDayOfMonth.getDay() - defaultedProps.startOfWeek + 7) % 7
    const weekCount = defaultedProps.fixedWeeks
      ? 6
      : Math.ceil((lastDayOfMonth.getDate() + prefixedDays) / 7)

    const currentDate = new Date(
      adjustedMonth.getFullYear(),
      adjustedMonth.getMonth(),
      1 - prefixedDays,
    )
    for (let i = 0; i < weekCount; i++) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      calendar.push(week)
    }

    return { month: adjustedMonth, weeks: calendar }
  }

  const navigate = (
    action: `${'prev' | 'next'}-${'month' | 'year'}` | ((date: Date) => Date),
  ) => {
    if (typeof action === 'function') {
      const newDate = action(month())
      setMonth(newDate)
      return
    }
    switch (action) {
      case 'prev-month':
        setMonth((month) => modifyMonth(month, { month: -1 }))
        break
      case 'next-month':
        setMonth((month) => modifyMonth(month, { month: 1 }))
        break
      case 'prev-year':
        setMonth((month) => modifyMonth(month, { year: -1 }))
        break
      case 'next-year':
        setMonth((month) => modifyMonth(month, { year: 1 }))
        break
    }
  }

  const onDaySelect = (day: Date) => {
    setFocusedDate(day)
    switch (defaultedProps.mode) {
      case 'single':
        if (value() === day && !defaultedProps.required) {
          setValue(null)
        } else {
          setValue(day)
        }
        break
      case 'multiple':
        setValue((value) => {
          value = value as Date[]
          const isSelected = value.includes(day)
          if (
            isSelected &&
            value.length !== defaultedProps.min &&
            !(value.length === 1 && defaultedProps.required)
          ) {
            return value.filter((d) => d !== day)
          }
          if (!isSelected && value.length !== defaultedProps.max) {
            return [...value, day]
          }
          return value
        })
        break
      case 'range':
        setValue((value) => {
          value = value as { from: Date | null; to: Date | null }
          if (value.from === null) {
            return { from: day, to: null }
          }
          if (value.to === null) {
            let from = value.from
            let to = day
            if (day < from) {
              to = from
              from = day
            }
            if (defaultedProps.excludeDisabled) {
              for (
                let date = new Date(from);
                date < to;
                date.setDate(date.getDate() + 1)
              ) {
                if (defaultedProps.disabled(date)) {
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

  const isSelected = (date: Date) => {
    let _value = value()
    switch (defaultedProps.mode) {
      case 'single':
        return isSameDay(_value as Date | null, date)
      case 'multiple':
        return (_value as Date[]).some((value) => isSameDay(value, date))
      case 'range':
        _value = _value as { from: Date | null; to: Date | null }
        return (
          isSameDay(_value.from, date) ||
          (isSameDayOrAfter(_value.from, date) &&
            isSameDayOrBefore(_value.to, date))
        )
    }
  }

  const isDisabled = (date: Date, _month?: Date) => {
    _month = _month ?? month()
    if (
      defaultedProps.disableOutsideDays &&
      date.getMonth() !== _month.getMonth()
    ) {
      return true
    }
    return defaultedProps.disabled(date)
  }

  const childrenProps: CalendarRootChildrenProps = {
    get mode() {
      return defaultedProps.mode
    },
    get value() {
      return value()
    },
    // @ts-expect-error: TODO: Fix types
    setValue,
    get month() {
      return month()
    },
    setMonth,
    get focusedDate() {
      return focusedDate()
    },
    setFocusedDate,
    get required() {
      return defaultedProps.required
    },
    get numberOfMonths() {
      return defaultedProps.numberOfMonths
    },
    get startOfWeek() {
      return defaultedProps.startOfWeek
    },
    get disableOutsideDays() {
      return defaultedProps.disableOutsideDays
    },
    get fixedWeeks() {
      return defaultedProps.fixedWeeks
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
    get textDirection() {
      return defaultedProps.textDirection
    },
    get labelId() {
      return labelId()
    },
    get weekdays() {
      return weekdays()
    },
    get months() {
      return months()
    },
    weeks,
    navigate,
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      // @ts-expect-error: TODO: Fix types
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
          // @ts-expect-error: TODO: Fix types
          mode: () => defaultedProps.mode,
          // @ts-expect-error: TODO: Fix types
          value,
          // @ts-expect-error: TODO: Fix types
          setValue,
          month,
          setMonth,
          focusedDate,
          setFocusedDate,
          required: () => defaultedProps.required,
          startOfWeek: () => defaultedProps.startOfWeek,
          numberOfMonths: () => defaultedProps.numberOfMonths,
          disableOutsideDays: () => defaultedProps.disableOutsideDays,
          fixedWeeks: () => defaultedProps.fixedWeeks,
          min: () => defaultedProps.min,
          max: () => defaultedProps.max,
          excludeDisabled: () => defaultedProps.excludeDisabled,
          weekdays,
          months,
          weeks,
          navigate,
          textDirection: () => defaultedProps.textDirection,
          labelId,
        }}
      >
        <InternalCalendarContext.Provider
          value={{
            // @ts-expect-error: TODO: Fix types
            mode: () => defaultedProps.mode,
            // @ts-expect-error: TODO: Fix types
            value,
            // @ts-expect-error: TODO: Fix types
            setValue,
            month,
            setMonth,
            focusedDate,
            setFocusedDate,
            required: () => defaultedProps.required,
            startOfWeek: () => defaultedProps.startOfWeek,
            numberOfMonths: () => defaultedProps.numberOfMonths,
            disableOutsideDays: () => defaultedProps.disableOutsideDays,
            fixedWeeks: () => defaultedProps.fixedWeeks,
            min: () => defaultedProps.min,
            max: () => defaultedProps.max,
            excludeDisabled: () => defaultedProps.excludeDisabled,
            weekdays,
            months,
            weeks,
            navigate,
            onDaySelect,
            textDirection: () => defaultedProps.textDirection,
            labelId,
            registerLabelId,
            unregisterLabelId,
            isSelected,
            isDisabled,
            isFocusing,
            setIsFocusing,
            disabled: defaultedProps.disabled,
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
