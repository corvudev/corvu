import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { type ValidComponent } from 'solid-js'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CalendarCellCorvuProps = {}

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

/** Calendar cell element.
 *
 * @data `data-corvu-calendar-cell` - Present on every calendar cell element.
 */
const CalendarCell = <T extends ValidComponent = 'td'>(
  props: DynamicProps<T, CalendarCellProps<T>>,
) => {
  return (
    <Dynamic<CalendarCellElementProps>
      as="td"
      // === ElementProps ===
      role="presentation"
      data-corvu-calendar-cell=""
      {...props}
    />
  )
}

export default CalendarCell
