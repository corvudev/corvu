import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalCalendarContext } from '@src/context'

export type CalendarTableCorvuProps = {
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarTableSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = 'table',
> =
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  {}

export type CalendarTableElementProps = CalendarTableSharedElementProps & {
  role: 'grid'
  'aria-labelledby': string | undefined
  'aria-multiselectable': 'true' | undefined
  'data-corvu-calendar-table': '' | null
}

export type CalendarTableProps<T extends ValidComponent = 'table'> =
  CalendarTableCorvuProps & Partial<CalendarTableSharedElementProps<T>>

/** Conditionally rendered container for calendar tables.
 *
 * @data `data-corvu-calendar-table` - Present on every calendar table element.
 */
const CalendarTable = <T extends ValidComponent = 'table'>(
  props: DynamicProps<T, CalendarTableProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarTableProps, [
    'contextId',
  ])

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  return (
    <Dynamic<CalendarTableElementProps>
      as="table"
      // === ElementProps ===
      role="grid"
      aria-labelledby={context().labelId()}
      aria-multiselectable={
        context().mode() === 'multiple' || context().mode() === 'range'
          ? 'true'
          : undefined
      }
      data-corvu-calendar-table=""
      {...otherProps}
    />
  )
}

export default CalendarTable
