import { access } from '@lib/utils'
import { createEffect, mergeProps, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

/** Disables scrolling of the body element.
 *
 * Adds padding to the body element to avoid layout shift because of the scrollbar disappearing. Also adds the `--scrollbar-width` CSS variable to the body, indicating the width of the scrollbar which disappeared. Useful for styling fixed elements which are affected by the scrollbar width.
 */
const createDisableScroll = (props: {
  /** Whether scrolling of the body element should be disabled. */
  enabled?: MaybeAccessor<boolean>
  /** Disable adding padding to the body element to avoid layout shift. */
  disablePreventScrollbarShift?: MaybeAccessor<boolean>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
    },
    props,
  )

  createEffect(() => {
    const { body } = document

    let originalOverflow: string | undefined
    let originalPaddingRight: string | undefined
    let scrollbarWidth: number | undefined

    if (access(defaultedProps.enabled)) {
      originalOverflow = body.style.overflow
      originalPaddingRight = body.style.paddingRight

      const originalWidth = body.offsetWidth
      body.style.overflow = 'hidden'
      scrollbarWidth = body.offsetWidth - originalWidth

      if (scrollbarWidth > 0) {
        body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
      }

      if (
        !access(defaultedProps.disablePreventScrollbarShift) &&
        scrollbarWidth > 0
      ) {
        body.style.paddingRight = `calc(${
          window.getComputedStyle(body).paddingRight
        } + ${scrollbarWidth}px)`
      }
    }

    onCleanup(() => {
      body.style.overflow = originalOverflow ?? ''
      if (scrollbarWidth && scrollbarWidth > 0) {
        body.style.paddingRight = originalPaddingRight ?? ''
        body.style.removeProperty('--scrollbar-width')
      }
      if (body.style.length === 0) {
        body.removeAttribute('style')
      }
    })
  })
}

export default createDisableScroll
