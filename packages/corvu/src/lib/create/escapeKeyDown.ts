import { createEffect, mergeProps, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

const createEscapeKeyDown = (props: {
  onEscapeKeyDown: (event: KeyboardEvent) => void
  enabled?: MaybeAccessor<boolean>
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
