import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createNoPointerEvents = (props: {
  isDisabled?: MaybeAccessor<boolean>
}) => {
  createEffect(() => {
    const { body } = document

    let originalPointerEvents: string | undefined

    if (!access(props.isDisabled)) {
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
