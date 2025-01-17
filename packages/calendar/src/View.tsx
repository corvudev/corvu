import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { combineStyle } from '@corvu/utils/dom'
import { useInternalCalendarContext } from '@src/context'

export type CalendarViewCorvuProps = {
  view: 'day' | 'month' | 'year'
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type CalendarViewSharedElementProps<T extends ValidComponent = 'div'> = {
  style: string | JSX.CSSProperties
}

export type CalendarViewElementProps = CalendarViewSharedElementProps & {
  hidden: boolean
  'data-corvu-calendar-view': '' | null
}

export type CalendarViewProps<T extends ValidComponent = 'div'> =
  CalendarViewCorvuProps & Partial<CalendarViewSharedElementProps<T>>

/** Conditionally rendered container for calendar views.
 *
 * @data `data-corvu-calendar-view` - Present on every calendar view element.
 */
const CalendarView = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, CalendarViewProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarViewProps, [
    'style',
    'view',
    'contextId',
  ])

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  return (
    <Dynamic<CalendarViewElementProps>
      as="div"
      // === SharedElementProps ===
      style={combineStyle(
        {
          display: context().view() !== localProps.view ? 'none' : undefined,
        },
        localProps.style,
      )}
      // === ElementProps ===
      hidden={context().view() !== localProps.view}
      data-corvu-calendar-view=""
      {...otherProps}
    />
  )
}

export default CalendarView
