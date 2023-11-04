import createDisablePointerEvents from '@lib/create/disablePointerEvents'
import createEscapeKeyDown from '@lib/create/escapeKeyDown'
import createOutsidePointerDown from '@lib/create/outsidePointerDown'
import { type Accessor } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

export type CreateDismissableProps = {
  element: Accessor<HTMLElement | null>
  onDismiss(reason: 'escape' | 'pointerDownOutside'): void
  disableDismissOnEscape?: MaybeAccessor<boolean>
  disableDismissOnOutsideInteract?: MaybeAccessor<boolean>
  onEscapeKeyDown?(event: KeyboardEvent): void
  onPointerDownOutside?(event: MouseEvent): void
}

const createDismissible = (props: CreateDismissableProps) => {
  createEscapeKeyDown({
    isDisabled: props.disableDismissOnEscape,
    onEscapeKeyDown: (event) => {
      props.onEscapeKeyDown?.(event)
      if (!event.defaultPrevented) {
        props.onDismiss('escape')
      }
    },
  })

  createOutsidePointerDown({
    isDisabled: props.disableDismissOnOutsideInteract,
    onPointerDown: (event) => {
      props.onPointerDownOutside?.(event)
      if (!event.defaultPrevented) {
        const ctrlLeftClick = event.button === 0 && event.ctrlKey === true
        // Don't dismiss if event is a right-click
        const isRightClick = event.button === 2 || ctrlLeftClick

        if (isRightClick) return

        props.onDismiss('pointerDownOutside')
      }
    },
    element: props.element,
  })

  createDisablePointerEvents({
    isDisabled: props.disableDismissOnOutsideInteract,
  })
}

export default createDismissible
