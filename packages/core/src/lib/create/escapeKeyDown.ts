import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createEscapeKeyDown = (props: {
  onEscapeKeyDown: (event: KeyboardEvent) => void
  isDisabled?: MaybeAccessor<boolean>
}) => {
  createEffect(() => {
    if (access(props.isDisabled)) {
      return
    }

    document.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      props.onEscapeKeyDown(event)
    }
  }
}

export default createEscapeKeyDown
