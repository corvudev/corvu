import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalCalendarContext } from '@src/context'

export type CalendarTableCorvuProps = {
  /**
   * The index of this calendar table. Is optional as it's not required if only one month is rendered.
   */
  index?: number
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

/** Table element for the calendar grid.
 *
 * @data `data-corvu-calendar-table` - Present on every calendar table element.
 */
const CalendarTable = <T extends ValidComponent = 'table'>(
  props: DynamicProps<T, CalendarTableProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarTableProps, [
    'index',
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
      aria-labelledby={context().labelIds()[localProps.index ?? 0]?.()}
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
