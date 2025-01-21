import {
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { isSameDay, isSameDayOrAfter, isSameDayOrBefore } from '@src/utils'
import { dataIf } from '@corvu/utils'
import { useInternalCalendarContext } from '@src/context'

export type CalendarCellCorvuProps = {
  /*
   * The day that this cell represents. Used to handle selection and focus.
   */
  day: Date
  /**
   * The month that this cell belongs to. Is optional as it's not required if only one month is rendered.
   */
  month?: Date
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarCellSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = 'td',
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
> = {}

export type CalendarCellElementProps = CalendarCellSharedElementProps & {
  role: 'presentation'
  'data-selected': '' | undefined
  'data-disabled': '' | undefined
  'data-today': '' | undefined
  'data-range-start': '' | undefined
  'data-range-end': '' | undefined
  'data-in-range': '' | undefined
  'data-corvu-calendar-cell': '' | null
}

export type CalendarCellProps<T extends ValidComponent = 'td'> =
  CalendarCellCorvuProps & Partial<CalendarCellSharedElementProps<T>>

/** Calendar cell element.
 *
 * @data `data-selected` - Present on selected calendar cells.
 * @data `data-disabled` - Present on disabled calendar cells.
 * @data `data-today` - Present on today's calendar cell trigger. Only rendered on the client to avoid hydration mismatches
 * @data `data-range-start` - Present on the start of a day range. (Only present in range mode)
 * @data `data-range-end` - Present on the end of a day range. (Only present in range mode)
 * @data `data-in-range` - Present on calendar cell elements that are within a day range. (Including start and end, only present in range mode)
 * @data `data-corvu-calendar-cell` - Present on every calendar cell element.
 */
const CalendarCell = <T extends ValidComponent = 'td'>(
  props: DynamicProps<T, CalendarCellProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarCellProps, [
    'day',
    'month',
    'contextId',
  ])

  const [isToday, setIsToday] = createSignal(false)
  createEffect(() => setIsToday(isSameDay(localProps.day, new Date())))

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  return (
    <Dynamic<CalendarCellElementProps>
      as="td"
      // === ElementProps ===
      role="presentation"
      data-selected={dataIf(context().isSelected(localProps.day))}
      data-disabled={dataIf(
        context().isDisabled(localProps.day, localProps.month),
      )}
      data-today={dataIf(isToday())}
      data-range-start={dataIf(
        context().mode() === 'range' &&
          isSameDay(
            localProps.day,
            (context().value() as { from: Date | null; to: Date | null }).from,
          ),
      )}
      data-range-end={dataIf(
        context().mode() === 'range' &&
          isSameDay(
            localProps.day,
            (context().value() as { from: Date | null; to: Date | null }).to,
          ),
      )}
      data-in-range={dataIf(
        context().mode() === 'range' &&
          isSameDayOrAfter(
            localProps.day,
            (context().value() as { from: Date | null; to: Date | null }).from,
          ) &&
          isSameDayOrBefore(
            localProps.day,
            (context().value() as { from: Date | null; to: Date | null }).to,
          ),
      )}
      data-corvu-calendar-cell=""
      {...otherProps}
    />
  )
}

export default CalendarCell
