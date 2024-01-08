import { createEffect, mergeProps, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

/**
 * Calls the `onPointerDown` callback when a pointer down event occurs outside of the given element.
 *
 * @param props.enabled - Whether the listener is enabled. *Default = `true`*
 * @param props.element - The element to check if the pointer down event occurred inside of.
 * @param props.onPointerDown - Callback fired when a pointer down event occurs outside of the given element.
 */
const createOutsidePointerDown = (props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  onPointerDown: (event: PointerEvent) => void
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
    },
    props,
  )

  createEffect(() => {
    if (!access(defaultedProps.enabled)) {
      return
    }
    document.addEventListener('pointerdown', handlePointerDown)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handlePointerDown)
    })
  })

  const handlePointerDown = (event: PointerEvent) => {
    const element = access(defaultedProps.element)
    if (element && !element.contains(event.target as Node)) {
      defaultedProps.onPointerDown(event)
    }
  }
}

export default createOutsidePointerDown
