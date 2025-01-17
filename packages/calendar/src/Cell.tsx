import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { dataIf } from '@corvu/utils'
import { isSameDay } from '@src/utils'
import { useInternalCalendarContext } from '@src/context'

export type CalendarCellCorvuProps = {
  day: Date
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
}

export type CalendarCellProps<T extends ValidComponent = 'td'> =
  CalendarCellCorvuProps & Partial<CalendarCellSharedElementProps<T>>

/** TODO
 *
 * @data `data-corvu-calendar-cell` - Present on every calendar cell element.
 */
const CalendarCell = <T extends ValidComponent = 'td'>(
  props: DynamicProps<T, CalendarCellProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarCellProps, [
    'day',
    'contextId',
  ])

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  return (
    <Dynamic<CalendarCellElementProps>
      as="td"
      // === ElementProps ===
      role="presentation"
      data-selected={dataIf(context().isSelected(localProps.day))}
      data-disabled={dataIf(context().isDisabled(localProps.day))}
      data-today={dataIf(isSameDay(new Date(), localProps.day))}
      data-range-start={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value().from?.getTime() === localProps.day.getTime(),
      )}
      data-range-end={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value().to?.getTime() === localProps.day.getTime(),
      )}
      data-in-range={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value().from?.getTime() <= localProps.day.getTime() &&
          // @ts-expect-error: TODO: Type narrowing
          context().value().to?.getTime() >= localProps.day.getTime(),
      )}
      data-corvu-calendar-cell=""
      {...otherProps}
    />
  )
}

export default CalendarCell
