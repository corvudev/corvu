import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import { createEffect, mergeProps, onCleanup } from 'solid-js'
import { contains } from '@corvu/utils/dom'

const EVENT_ON_FOCUS = 'dismissible.outsideFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/**
 * Calls the `onFocus` callback when a `focusin` event occurs outside of the given element.
 *
 * @param props.element - The element to check if the focus event occurred inside of.
 * @param props.enabled - Whether the listener is enabled. *Default = `true`*
 * @param props.onFocus - Callback fired when a focus event occurs outside of the given element.
 * @param props.ignorePointerEvents - Whether to ignore focus events triggered by a pointer.
 */
const createOutsideFocus = (props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  onFocus: (event: CustomEvent) => void
  ignorePointerEvents?: MaybeAccessor<boolean>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      ignorePointerEvents: false,
    },
    props,
  )

  let pointerDown = false

  createEffect(() => {
    if (!access(defaultedProps.enabled)) {
      return
    }

    const ignorePointerEvents = access(defaultedProps.ignorePointerEvents)

    document.addEventListener('focusin', handleFocus)
    if (ignorePointerEvents) {
      document.addEventListener('pointerdown', handlePointerDown)
    }

    onCleanup(() => {
      document.removeEventListener('focusin', handleFocus)
      if (ignorePointerEvents) {
        document.removeEventListener('pointerdown', handlePointerDown)
      }
    })
  })

  const handleFocus = (event: FocusEvent) => {
    if (pointerDown) {
      pointerDown = false
      return
    }
    const element = access(defaultedProps.element)
    if (element && !contains(element, event.target as HTMLElement)) {
      const customEvent = new CustomEvent(EVENT_ON_FOCUS, EVENT_OPTIONS)
      element.dispatchEvent(customEvent)
      defaultedProps.onFocus(customEvent)
    }
  }

  const handlePointerDown = () => {
    pointerDown = true
  }
}

export default createOutsideFocus
