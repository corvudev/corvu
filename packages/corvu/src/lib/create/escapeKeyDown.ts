import { access, type MaybeAccessor } from '@corvu/utils'
import { createEffect, mergeProps, onCleanup } from 'solid-js'

/**
 * Listens for the escape key to be pressed and calls the `onEscapeKeyDown` callback.
 *
 * @param props.enabled - Whether the listener is enabled. *Default = `true`*
 * @param props.onEscapeKeyDown - Callback fired when the escape key is pressed.
 */
const createEscapeKeyDown = (props: {
  enabled?: MaybeAccessor<boolean>
  onEscapeKeyDown: (event: KeyboardEvent) => void
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

    document.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      defaultedProps.onEscapeKeyDown(event)
    }
  }
}

export default createEscapeKeyDown
