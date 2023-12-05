import createEscapeKeyDown from '@lib/create/escapeKeyDown'
import createNoPointerEvents from '@lib/create/noPointerEvents'
import createOutsidePointerDown from '@lib/create/outsidePointerDown'
import { access } from '@lib/utils'
import { type Accessor } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

export type CreateDismissableProps = {
  element: Accessor<HTMLElement | null>
  onDismiss(reason: 'escape' | 'pointerDownOutside'): void
  disableDismissOnEscapeKeyDown?: MaybeAccessor<boolean>
  disableDismissOnOutsidePointerDown?: MaybeAccessor<boolean>
  disableNoOutsidePointerEvents?: MaybeAccessor<boolean>
  onEscapeKeyDown?(event: KeyboardEvent): void
  onOutsidePointerDown?(event: MouseEvent): void
}

const createDismissible = (props: CreateDismissableProps) => {
  createEscapeKeyDown({
    enabled: () => !access(props.disableDismissOnEscapeKeyDown),
    onEscapeKeyDown: (event) => {
      props.onEscapeKeyDown?.(event)
      if (!event.defaultPrevented) {
        props.onDismiss('escape')
      }
    },
  })

  createOutsidePointerDown({
    enabled: () => !access(props.disableDismissOnOutsidePointerDown),
    onPointerDown: (event) => {
      props.onOutsidePointerDown?.(event)
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

  createNoPointerEvents({
    enabled: () => !access(props.disableNoOutsidePointerEvents),
  })
}

export default createDismissible
