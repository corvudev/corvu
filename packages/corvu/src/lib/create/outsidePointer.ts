import { createEffect, mergeProps, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

/**
 * Calls the `onPointer` callback when a `pointerdown` or `pointerup` event occurs outside of the given element.
 *
 * @param props.element - The element to check if the pointer down event occurred inside of.
 * @param props.enabled - Whether the listener is enabled. *Default = `true`*
 * @param props.strategy - Whether to listen for `pointerdown` or `pointerup` events. *Default = `pointerup`*
 * @param props.ignore - Ignore pointer events that occur inside of this element.
 * @param props.onPointer - Callback fired when a pointer event occurs outside of the given element.
 */
const createOutsidePointer = (props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  strategy?: MaybeAccessor<'pointerdown' | 'pointerup'>
  ignore?: MaybeAccessor<HTMLElement | null>
  onPointer: (event: PointerEvent) => void
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      strategy: 'pointerup' as const,
    },
    props,
  )

  createEffect(() => {
    if (!access(defaultedProps.enabled)) {
      return
    }
    const strategy = access(defaultedProps.strategy)

    document.addEventListener(strategy, handlePointer)

    onCleanup(() => {
      document.removeEventListener(strategy, handlePointer)
    })
  })

  const handlePointer = (event: PointerEvent) => {
    const element = access(defaultedProps.element)
    const ignore = access(defaultedProps.ignore)
    if (
      element &&
      !element.contains(event.target as Node) &&
      !(ignore && ignore.contains(event.target as Node))
    ) {
      defaultedProps.onPointer(event)
    }
  }
}

export default createOutsidePointer
