import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { type ValidComponent } from 'solid-js'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CalendarHeadCellCorvuProps = {}

export type CalendarHeadCellSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = 'th',
> = {
  abbr?: string
}

export type CalendarHeadCellElementProps =
  CalendarHeadCellSharedElementProps & {
    scope: 'col'
    'data-corvu-calendar-headcell': '' | null
  }

export type CalendarHeadCellProps<T extends ValidComponent = 'th'> =
  CalendarHeadCellCorvuProps & Partial<CalendarHeadCellSharedElementProps<T>>

/** Calendar column header cell.
 *
 * @data `data-corvu-calendar-headcell` - Present on every calendar headcell element.
 */
const CalendarHeadCell = <T extends ValidComponent = 'th'>(
  props: DynamicProps<T, CalendarHeadCellProps<T>>,
) => {
  return (
    <Dynamic<CalendarHeadCellElementProps>
      as="th"
      // === ElementProps ===
      scope="col"
      data-corvu-calendar-headcell=""
      {...props}
    />
  )
}

export default CalendarHeadCell
