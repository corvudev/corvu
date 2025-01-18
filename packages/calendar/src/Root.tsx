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
import { dateIsInRange, isSameDay, modifyDate } from '@src/utils'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createOnce from '@corvu/utils/create/once'
import createRegister from '@corvu/utils/create/register'
import { isFunction } from '@corvu/utils'

export type DateValue = Date | Date[] | { from: Date; to: Date } | null

export type CalendarRootProps = {
  mode: 'single' | 'multiple' | 'range'
  value?: DateValue
  onValueChange?: (value: DateValue) => void
  initialValue?: DateValue
  month?: Date
  onMonthChange?: (month: Date) => void
  initialMonth?: Date
  focusedDate?: Date
  onFocusedDateChange?: (focusedDate: Date) => void
  initialFocusedDate?: Date
  view?: 'day' | 'month' | 'year'
  onViewChange?: (view: 'day' | 'month' | 'year') => void
  initialView?: 'day' | 'month' | 'year'
  required?: boolean
  startOfWeek?: number
  // Number of months to be rendered. Is used for keyboard navigation. Default: 1
  numberOfMonths?: number
  disableOutsideDays?: boolean
  disabled?: (date: Date) => boolean
  fixedWeeks?: boolean
  // TODO: multiple mode only
  min?: number | null
  // TODO: multiple mode only
  max?: number | null
  /**
   * The `id` attribute of the calendar label element.
   * @defaultValue `createUniqueId()`
   */
  labelId?: string
  /**
   * The `id` of the calendar context. Useful if you have nested calendars and want to create components that belong to a calendar higher up in the tree.
   */
  contextId?: string
  /** @hidden */
  children: JSX.Element | ((props: CalendarRootChildrenProps) => JSX.Element)
}

/** Props that are passed to the Root component children callback. */
export type CalendarRootChildrenProps = {
  mode: 'single' | 'multiple' | 'range'
  value: DateValue
  setValue: Setter<DateValue>
  month: Date
  setMonth: Setter<Date>
  focusedDate: Date
  setFocusedDate: Setter<Date>
  view: 'day' | 'month' | 'year'
  setView: Setter<'day' | 'month' | 'year'>
  required: boolean
  startOfWeek: number
  numberOfMonths: number
  disableOutsideDays: boolean
  fixedWeeks: boolean
  min: number | null
  max: number | null
  weekdays: Date[]
  months: () => { month: Date; weeks: Date[][] }[]
  weeks: (monthOffset?: number) => { month: Date; weeks: Date[][] }
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
      initialValue: props.mode === 'multiple' ? [] : null,
      initialMonth: new Date(),
      initialFocusedDate: new Date(),
      initialView: 'day' as const,
      required: false,
      startOfWeek: 1,
      numberOfMonths: 1,
      disableOutsideDays: true,
      fixedWeeks: false,
      min: null,
      max: null,
      disabled: () => false,
    },
    props,
  )

  const [value, setValue] = createControllableSignal({
    value: () => defaultedProps.value,
    initialValue: defaultedProps.initialValue,
    onChange: defaultedProps.onValueChange,
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

  const [view, setView] = createControllableSignal({
    value: () => defaultedProps.view,
    initialValue: defaultedProps.initialView,
    onChange: defaultedProps.onViewChange,
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
          setFocusedDateInternal(
            (focusedDate) =>
              new Date(
                nextValue.getFullYear(),
                nextValue.getMonth(),
                focusedDate.getDate(),
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
          const isBefore = nextValue < month()
          const newMonth = new Date(
            month().getFullYear(),
            isBefore
              ? month().getMonth() - defaultedProps.numberOfMonths
              : month().getMonth() + defaultedProps.numberOfMonths,
          )
          if (month().getTime() !== newMonth.getTime()) {
            setMonthInternal(newMonth)
          }
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
        setMonth((month) => modifyDate(month, { month: -1 }))
        break
      case 'next-month':
        setMonth((month) => modifyDate(month, { month: 1 }))
        break
      case 'prev-year':
        setMonth((month) => modifyDate(month, { year: -1 }))
        break
      case 'next-year':
        setMonth((month) => modifyDate(month, { year: 1 }))
        break
    }
  }

  const onDaySelect = (day: Date) => {
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
          // TODO: Fix after type narrowing
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
          // TODO: Fix after type narrowing
          const newValue = value as { from: Date; to: Date } | null

          if (newValue === null) {
            return { from: day, to: day }
          }
          if (
            isSameDay(day, newValue.from) &&
            isSameDay(day, newValue.to) &&
            !defaultedProps.required
          ) {
            return null
          }
          if (isSameDay(day, newValue.from) || isSameDay(day, newValue.to)) {
            return { from: day, to: day }
          }
          if (day < newValue.from) {
            return { from: day, to: newValue.to }
          }
          return { from: newValue.from, to: day }
        })
    }
  }

  const isSelected = (date: Date) => {
    const _value = value()
    if (_value === null) return false
    switch (defaultedProps.mode) {
      case 'single':
        // @ts-expect-error: TODO: Type narrowing
        return isSameDay(_value, date)
      case 'multiple':
        // @ts-expect-error: TODO: Type narrowing
        return _value.some((value) => isSameDay(value, date))
      case 'range':
        return (
          // @ts-expect-error: TODO: Type narrowing
          isSameDay(_value.from, date) ||
          // @ts-expect-error: TODO: Type narrowing
          (_value.from < date &&
            // @ts-expect-error: TODO: Type narrowing
            (_value.to > date || isSameDay(_value.to, date)))
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
    setValue,
    get month() {
      return month()
    },
    setMonth,
    get focusedDate() {
      return focusedDate()
    },
    setFocusedDate,
    get view() {
      return view()
    },
    setView,
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
    get labelId() {
      return labelId()
    },
    get weekdays() {
      return weekdays()
    },
    months,
    weeks,
    navigate,
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
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
          mode: () => defaultedProps.mode,
          value,
          setValue,
          month,
          setMonth,
          focusedDate,
          setFocusedDate,
          view,
          setView,
          required: () => defaultedProps.required,
          startOfWeek: () => defaultedProps.startOfWeek,
          numberOfMonths: () => defaultedProps.numberOfMonths,
          disableOutsideDays: () => defaultedProps.disableOutsideDays,
          fixedWeeks: () => defaultedProps.fixedWeeks,
          min: () => defaultedProps.min,
          max: () => defaultedProps.max,
          weekdays,
          months,
          weeks,
          navigate,
          labelId,
        }}
      >
        <InternalCalendarContext.Provider
          value={{
            mode: () => defaultedProps.mode,
            value,
            setValue,
            month,
            setMonth,
            focusedDate,
            setFocusedDate,
            view,
            setView,
            required: () => defaultedProps.required,
            startOfWeek: () => defaultedProps.startOfWeek,
            numberOfMonths: () => defaultedProps.numberOfMonths,
            disableOutsideDays: () => defaultedProps.disableOutsideDays,
            fixedWeeks: () => defaultedProps.fixedWeeks,
            min: () => defaultedProps.min,
            max: () => defaultedProps.max,
            weekdays,
            months,
            weeks,
            navigate,
            onDaySelect,
            labelId,
            registerLabelId,
            unregisterLabelId,
            isSelected,
            isDisabled,
            isFocusing,
            setIsFocusing,
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
