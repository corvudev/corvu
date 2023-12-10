import createEscapeKeyDown from '@lib/create/escapeKeyDown'
import createNoPointerEvents from '@lib/create/noPointerEvents'
import createOutsidePointerDown from '@lib/create/outsidePointerDown'
import { mergeProps, type Accessor } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

export type CreateDismissableProps = {
  element: Accessor<HTMLElement | null>
  onDismiss(reason: 'escapeKey' | 'pointerDownOutside'): void
  dismissOnEscapeKeyDown?: MaybeAccessor<boolean>
  dismissOnOutsidePointerDown?: MaybeAccessor<boolean>
  noOutsidePointerEvents?: MaybeAccessor<boolean>
  onEscapeKeyDown?(event: KeyboardEvent): void
  onOutsidePointerDown?(event: MouseEvent): void
}

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
