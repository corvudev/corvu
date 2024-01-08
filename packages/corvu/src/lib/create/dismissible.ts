import createEscapeKeyDown from '@lib/create/escapeKeyDown'
import createNoPointerEvents from '@lib/create/noPointerEvents'
import createOutsidePointerDown from '@lib/create/outsidePointerDown'
import type { MaybeAccessor } from '@lib/types'
import { mergeProps } from 'solid-js'

export type CreateDismissableProps = {
  /** The element to make dismissable. */
  element: MaybeAccessor<HTMLElement | null>
  /** Callback fired when the element is being dismissed. */
  onDismiss(reason: 'escapeKey' | 'pointerDownOutside'): void
  /** Whether to dismiss the element when the escape key is pressed. *Default = `true`* */
  dismissOnEscapeKeyDown?: MaybeAccessor<boolean>
  /** Whether to dismiss the element when a pointer down event happens outside the element. *Default = `true`* */
  dismissOnOutsidePointerDown?: MaybeAccessor<boolean>
  /** Whether to disable pointer events outside the element. *Default = `true`* */
  noOutsidePointerEvents?: MaybeAccessor<boolean>
  /** Callback fired when the escape key is pressed. Can be prevented by calling `event.preventDefault`. */
  onEscapeKeyDown?(event: KeyboardEvent): void
  /** Callback fired when a pointer down event happens outside the element. Can be prevented by calling `event.preventDefault`. */
  onOutsidePointerDown?(event: MouseEvent): void
}

/**
 * Creates a dismissible element that can be dismissed by pressing the escape key or clicking outside the element.
 *
 * @param props.element - The element to make dismissable.
 * @param props.onDismiss - Callback fired when the element is being dismissed.
 * @param props.dismissOnEscapeKeyDown - Whether to dismiss the element when the escape key is pressed. *Default = `true`*
 * @param props.dismissOnOutsidePointerDown - Whether to dismiss the element when a pointer down event happens outside the element. *Default = `true`*
 * @param props.noOutsidePointerEvents - Whether to disable pointer events outside the element. *Default = `true`*
 * @param props.onEscapeKeyDown - Callback fired when the escape key is pressed. Can be prevented by calling `event.preventDefault`.
 * @param props.onOutsidePointerDown - Callback fired when a pointer down event happens outside the element. Can be prevented by calling `event.preventDefault`.
 */
const createDismissible = (props: CreateDismissableProps) => {
  const defaultedProps = mergeProps(
    {
      dismissOnEscapeKeyDown: true,
      dismissOnOutsidePointerDown: true,
      noOutsidePointerEvents: true,
    },
    props,
  )

  createEscapeKeyDown({
    enabled: defaultedProps.dismissOnEscapeKeyDown,
    onEscapeKeyDown: (event) => {
      defaultedProps.onEscapeKeyDown?.(event)
      if (!event.defaultPrevented) {
        defaultedProps.onDismiss('escapeKey')
      }
    },
  })

  createOutsidePointerDown({
    enabled: defaultedProps.dismissOnOutsidePointerDown,
    onPointerDown: (event) => {
      defaultedProps.onOutsidePointerDown?.(event)
      if (!event.defaultPrevented) {
        const ctrlLeftClick = event.button === 0 && event.ctrlKey === true
        // Don't dismiss if event is a right-click
        const isRightClick = event.button === 2 || ctrlLeftClick

        if (isRightClick) return

        defaultedProps.onDismiss('pointerDownOutside')
      }
    },
    element: defaultedProps.element,
  })

  createNoPointerEvents({
    enabled: defaultedProps.noOutsidePointerEvents,
  })
}

export default createDismissible
