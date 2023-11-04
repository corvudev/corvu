import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createDisableScroll = (props: {
  isDisabled?: MaybeAccessor<boolean>
  ownerDocument?: MaybeAccessor<Document | null>
}) => {
  createEffect(() => {
    const ownerDocument = access(props.ownerDocument) ?? document
    const { body } = ownerDocument

    let originalOverflow: string | undefined

    if (!access(props.isDisabled)) {
      originalOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    }

    onCleanup(() => {
      body.style.overflow = originalOverflow ?? ''
      if (body.style.length === 0) {
        body.removeAttribute('style')
      }
    })
  })
}

export default createDisableScroll
