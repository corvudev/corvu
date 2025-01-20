import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { splitProps, type ValidComponent } from 'solid-js'

export type CalendarHeadCellCorvuProps = {
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarHeadCellSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = 'th',
> = {
  abbr: string | undefined
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
  const [localProps, otherProps] = splitProps(props as CalendarHeadCellProps, [
    'contextId',
    'abbr',
  ])

  return (
    <Dynamic<CalendarHeadCellElementProps>
      as="th"
      // === SharedElementProps ===
      abbr={localProps.abbr}
      // === ElementProps ===
      scope="col"
      data-corvu-calendar-headcell=""
      {...otherProps}
    />
  )
}

export default CalendarHeadCell
