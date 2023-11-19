import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createDisableScroll = (props: {
  isDisabled?: MaybeAccessor<boolean>
  disablePreventScrollbarShift?: MaybeAccessor<boolean>
}) => {
  createEffect(() => {
    const { body } = document

    let originalOverflow: string | undefined
    let originalPaddingRight: string | undefined

    if (!access(props.isDisabled)) {
      originalOverflow = body.style.overflow
      originalPaddingRight = body.style.paddingRight
      const originalWidth = body.offsetWidth

      body.style.overflow = 'hidden'

      const scrollBarWidth = body.offsetWidth - originalWidth

      body.style.setProperty('--scrollbar-width', `${scrollBarWidth}px`)

      if (!access(props.disablePreventScrollbarShift) && scrollBarWidth > 0) {
        body.style.paddingRight = `calc(${
          window.getComputedStyle(body).paddingRight
        } + ${scrollBarWidth}px)`
      }
    }

    onCleanup(() => {
      body.style.overflow = originalOverflow ?? ''
      body.style.paddingRight = originalPaddingRight ?? ''
      body.style.removeProperty('--scrollbar-width')
      if (body.style.length === 0) {
        body.removeAttribute('style')
      }
    })
  })
}

export default createDisableScroll
