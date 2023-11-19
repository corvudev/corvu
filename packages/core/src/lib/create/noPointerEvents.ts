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

    let originalPointerEvents: string | undefined

    if (access(defaultedProps.enabled)) {
      originalPointerEvents = body.style.pointerEvents
      body.style.pointerEvents = 'none'
    }

    onCleanup(() => {
      body.style.pointerEvents = originalPointerEvents ?? ''
      if (body.style.length === 0) {
        body.removeAttribute('style')
      }
    })
  })
}

export default createNoPointerEvents
