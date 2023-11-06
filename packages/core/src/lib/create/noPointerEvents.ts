import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createNoPointerEvents = (props: {
  isDisabled?: MaybeAccessor<boolean>
  ownerDocument?: MaybeAccessor<Document | null>
}) => {
  createEffect(() => {
    const ownerDocument = access(props.ownerDocument) ?? document
    const { body } = ownerDocument

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
