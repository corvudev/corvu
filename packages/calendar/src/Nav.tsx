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
import type { DateValue } from '@internationalized/date'
import { useInternalCalendarContext } from '@src/context'

export type CalendarNavCorvuProps = {
  /**
   * The action to perform when pressing this navigation button.
   */
  action:
    | `${'prev' | 'next'}-${'month' | 'year'}`
    | ((date: DateValue) => DateValue)
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarNavSharedElementProps<T extends ValidComponent = 'button'> =
  {
    onClick: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
  } & DynamicButtonSharedElementProps<T>

export type CalendarNavElementProps = CalendarNavSharedElementProps & {
  'data-corvu-calendar-nav': '' | null
} & DynamicButtonElementProps

export type CalendarNavProps<T extends ValidComponent = 'button'> =
  CalendarNavCorvuProps & Partial<CalendarNavSharedElementProps<T>>

/** Button to navigate the calendar.
 *
 * @data `data-corvu-calendar-nav` - Present on every calendar nav element.
 */
const CalendarNav = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, CalendarNavProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as CalendarNavProps, [
    'action',
    'contextId',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().navigate(localProps.action)
  }

  return (
    <DynamicButton<
      Component<Omit<CalendarNavElementProps, keyof DynamicButtonElementProps>>
    >
      // === SharedElementProps ===
      onClick={onClick}
      // === ElementProps ===
      data-corvu-calendar-nav=""
      {...otherProps}
    />
  )
}

export default CalendarNav
