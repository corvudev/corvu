import { access } from '@lib/utils'
import { createEffect, mergeProps, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createNoPointerEvents = (props: { enabled?: MaybeAccessor<boolean> }) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
    },
    props,
  )

  createEffect(() => {
    const { body } = document

    if (!access(defaultedProps.enabled)) return

    const originalPointerEvents = body.style.pointerEvents
    const originalUserSelect = body.style.userSelect

    body.style.pointerEvents = 'none'
    body.style.userSelect = 'none'

    onCleanup(() => {
      body.style.pointerEvents = originalPointerEvents
      body.style.userSelect = originalUserSelect
      if (body.style.length === 0) {
        body.removeAttribute('style')
      }
    })
  })
}

export default createNoPointerEvents
