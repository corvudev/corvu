import {
  batch,
  createMemo,
  createSignal,
  type JSX,
  on,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { callEventHandler, type ElementOf, type Ref } from '@corvu/utils/dom'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import {
  isSameDay,
  isSameDayOrAfter,
  isSameDayOrBefore,
  modifyDate,
} from '@src/utils'
import { createEffect } from 'solid-js'
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalCalendarContext } from '@src/context'

export type CalendarCellTriggerCorvuProps = {
  value: Date
  // The month that this cell belongs to. Used to determine if the cell is outside the current month and should be disabled.
  month?: Date
  /**
   * The `id` of the calendar context to use.
   */
  contextId?: string
}

export type CalendarCellTriggerSharedElementProps<
  T extends ValidComponent = 'button',
> = {
  ref: Ref<ElementOf<T>>
  onClick: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
  onKeyDown: JSX.EventHandlerUnion<ElementOf<T>, KeyboardEvent>
  disabled: boolean | undefined
}

export type CalendarCellTriggerElementProps =
  CalendarCellTriggerSharedElementProps & {
    role: 'gridcell'
    tabIndex: number
    'aria-selected': 'true' | undefined
    'aria-disabled': 'true' | undefined
    'data-disabled': '' | undefined
    'data-corvu-calendar-celltrigger': '' | null
  }

export type CalendarCellTriggerProps<T extends ValidComponent = 'button'> =
  CalendarCellTriggerCorvuProps &
    Partial<CalendarCellTriggerSharedElementProps<T>>

/** TODO
 *
 * @data `data-corvu-calendar-celltrigger` - Present on every calendar celltrigger element.
 */
const CalendarCellTrigger = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, CalendarCellTriggerProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(
    props as CalendarCellTriggerProps,
    ['value', 'month', 'contextId', 'ref', 'onClick', 'onKeyDown', 'disabled'],
  )

  const [ref, setRef] = createSignal<HTMLButtonElement | null>(null)

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  createEffect(
    on(
      [context().focusedDate, () => localProps.value, () => localProps.month],
      ([focusedDate, value, month]) => {
        if (!context().isFocusing()) return
        if (context().isDisabled(value, month)) return
        if (isSameDay(focusedDate, value)) {
          ref()?.focus()
          context().setIsFocusing(false)
        }
      },
    ),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().onDaySelect(localProps.value)
  }

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onKeyDown, event)) return

    batch(() => {
      switch (event.key) {
        case 'ArrowLeft':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.value, { day: -1 }))
          break
        case 'ArrowRight':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.value, { day: 1 }))
          break
        case 'ArrowUp':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.value, { day: -7 }))
          break
        case 'ArrowDown':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.value, { day: 7 }))
          break
        case 'Home':
          context().setIsFocusing(true)
          context().setFocusedDate(
            modifyDate(localProps.value, {
              day: -(
                (localProps.value.getDay() - context().startOfWeek() + 7) %
                7
              ),
            }),
          )
          break
        case 'End':
          context().setIsFocusing(true)
          context().setFocusedDate(
            modifyDate(localProps.value, {
              day:
                (context().startOfWeek() + 6 - localProps.value.getDay() + 7) %
                7,
            }),
          )
          break
        case 'PageUp':
          context().setIsFocusing(true)
          if (event.shiftKey) {
            context().setFocusedDate(modifyDate(localProps.value, { year: -1 }))
          } else {
            context().setFocusedDate(
              modifyDate(localProps.value, { month: -1 }),
            )
          }
          break
        case 'PageDown':
          context().setIsFocusing(true)
          if (event.shiftKey) {
            context().setFocusedDate(modifyDate(localProps.value, { year: 1 }))
          } else {
            context().setFocusedDate(modifyDate(localProps.value, { month: 1 }))
          }
          break
      }
    })
  }

  return (
    <Dynamic<CalendarCellTriggerElementProps>
      as="button"
      // === SharedElementProps ===
      ref={mergeRefs(setRef, localProps.ref)}
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={
        localProps.disabled === true ||
        context().isDisabled(localProps.value, localProps.month) ||
        undefined
      }
      // === ElementProps ===
      role="gridcell"
      tabIndex={isSameDay(context().focusedDate(), localProps.value) ? 0 : -1}
      aria-selected={
        context().isSelected(localProps.value) ? 'true' : undefined
      }
      aria-disabled={
        context().isDisabled(localProps.value, localProps.month)
          ? 'true'
          : undefined
      }
      data-selected={dataIf(context().isSelected(localProps.value))}
      data-disabled={dataIf(
        context().isDisabled(localProps.value, localProps.month),
      )}
      data-today={dataIf(isSameDay(localProps.value, new Date()))}
      data-range-start={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          isSameDay(localProps.value, context().value().from),
      )}
      data-range-end={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          isSameDay(localProps.value, context().value().to),
      )}
      data-in-range={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          isSameDayOrAfter(localProps.value, context().value().from) &&
          // @ts-expect-error: TODO: Type narrowing
          isSameDayOrBefore(localProps.value, context().value().to),
      )}
      data-corvu-calendar-celltrigger=""
      {...otherProps}
    />
  )
}

export default CalendarCellTrigger
