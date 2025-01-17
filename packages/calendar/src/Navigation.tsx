import { callEventHandler, type ElementOf } from '@corvu/utils/dom'
import {
  type Component,
  createMemo,
  type JSX,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  DynamicButton,
  type DynamicButtonElementProps,
  type DynamicButtonSharedElementProps,
  type DynamicProps,
} from '@corvu/utils/dynamic'
import { useInternalCalendarContext } from '@src/context'

export type CalendarNavigationCorvuProps = {
  action: `${'prev' | 'next'}-${'month' | 'year'}` | ((date: Date) => Date)
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarNavigationSharedElementProps<
  T extends ValidComponent = 'button',
> = {
  onClick: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
} & DynamicButtonSharedElementProps<T>

export type CalendarNavigationElementProps =
  CalendarNavigationSharedElementProps & {
    'data-corvu-calendar-navigation': '' | null
  } & DynamicButtonElementProps

export type CalendarNavigationProps<T extends ValidComponent = 'button'> =
  CalendarNavigationCorvuProps &
    Partial<CalendarNavigationSharedElementProps<T>>

/** Button to navigate the calendar.
 *
 * @data `data-corvu-calendar-navigation` - Present on every calendar navigation element.
 */
const CalendarNavigation = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, CalendarNavigationProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(
    props as CalendarNavigationProps,
    ['action', 'contextId', 'ref', 'onClick'],
  )

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().navigate(localProps.action)
  }

  return (
    <DynamicButton<
      Component<
        Omit<CalendarNavigationElementProps, keyof DynamicButtonElementProps>
      >
    >
      // === SharedElementProps ===
      onClick={onClick}
      // === ElementProps ===
      data-corvu-calendar-navigation=""
      {...otherProps}
    />
  )
}

export default CalendarNavigation
