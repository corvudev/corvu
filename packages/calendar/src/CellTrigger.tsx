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
import { isSameDay, modifyDate } from '@src/utils'
import { createEffect } from 'solid-js'
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalCalendarContext } from '@src/context'

export type CalendarCellTriggerCorvuProps = {
  day: Date
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
    ['day', 'contextId', 'ref', 'onClick', 'onKeyDown', 'disabled'],
  )

  const [ref, setRef] = createSignal<HTMLButtonElement | null>(null)

  const context = createMemo(() =>
    useInternalCalendarContext(localProps.contextId),
  )

  createEffect(
    on([context().focusedDate, () => localProps.day], ([focusedDate, day]) => {
      if (!context().isFocusing()) return
      if (isSameDay(focusedDate, day)) {
        ref()?.focus()
        context().setIsFocusing(false)
      }
    }),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().onDaySelect(localProps.day)
  }

  const onKeyDown: JSX.EventHandlerUnion<HTMLButtonElement, KeyboardEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onKeyDown, event)) return

    batch(() => {
      switch (event.key) {
        case 'ArrowLeft':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.day, { day: -1 }))
          break
        case 'ArrowRight':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.day, { day: 1 }))
          break
        case 'ArrowUp':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.day, { day: -7 }))
          break
        case 'ArrowDown':
          context().setIsFocusing(true)
          context().setFocusedDate(modifyDate(localProps.day, { day: 7 }))
          break
        case 'Home':
          context().setIsFocusing(true)
          context().setFocusedDate(
            modifyDate(localProps.day, {
              day: -(
                (localProps.day.getDay() - context().startOfWeek() + 7) %
                7
              ),
            }),
          )
          break
        case 'End':
          context().setIsFocusing(true)
          context().setFocusedDate(
            modifyDate(localProps.day, {
              day:
                (context().startOfWeek() + 6 - localProps.day.getDay() + 7) % 7,
            }),
          )
          break
        case 'PageUp':
          context().setIsFocusing(true)
          if (event.shiftKey) {
            context().setFocusedDate(modifyDate(localProps.day, { year: -1 }))
          } else {
            context().setFocusedDate(modifyDate(localProps.day, { month: -1 }))
          }
          break
        case 'PageDown':
          context().setIsFocusing(true)
          if (event.shiftKey) {
            context().setFocusedDate(modifyDate(localProps.day, { year: 1 }))
          } else {
            context().setFocusedDate(modifyDate(localProps.day, { month: 1 }))
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
        context().isDisabled(localProps.day) ||
        undefined
      }
      // === ElementProps ===
      role="gridcell"
      tabIndex={isSameDay(context().focusedDate(), localProps.day) ? 0 : -1}
      aria-selected={context().isSelected(localProps.day) ? 'true' : undefined}
      aria-disabled={context().isDisabled(localProps.day) ? 'true' : undefined}
      data-selected={dataIf(context().isSelected(localProps.day))}
      data-disabled={dataIf(context().isDisabled(localProps.day))}
      data-today={dataIf(isSameDay(new Date(), localProps.day))}
      data-range-start={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value()?.from.getTime() === localProps.day.getTime(),
      )}
      data-range-end={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value()?.to.getTime() === localProps.day.getTime(),
      )}
      data-in-range={dataIf(
        context().mode() === 'range' &&
          // @ts-expect-error: TODO: Type narrowing
          context().value()?.from.getTime() <= localProps.day.getTime() &&
          // @ts-expect-error: TODO: Type narrowing
          context().value()?.to.getTime() >= localProps.day.getTime(),
      )}
      data-corvu-calendar-celltrigger=""
      {...otherProps}
    />
  )
}

export default CalendarCellTrigger
