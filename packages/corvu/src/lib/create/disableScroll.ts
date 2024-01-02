import { createEffect, mergeProps } from 'solid-js'
import { access } from '@lib/utils'
import createStyle from '@lib/create/style'
import { isIOS } from '@lib/platform'
import type { MaybeAccessor } from '@lib/types'

/** Disables scrolling of the body element.
 *
 * Adds padding to the body element to avoid layout shift because of the scrollbar disappearing. Also adds the `--scrollbar-width` CSS variable to the body, indicating the width of the scrollbar which disappeared. Useful for styling fixed elements which are affected by the scrollbar width.
 */
const createDisableScroll = (props: {
  /** Whether scrolling of the body element should be disabled. */
  enabled?: MaybeAccessor<boolean>
  /** Whether padding should be added to the body element to avoid layout shift. */
  preventScrollbarShift?: MaybeAccessor<boolean>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      preventScrollbarShift: true,
    },
    props,
  )

  createEffect(() => {
    const { body } = document

    if (!access(defaultedProps.enabled)) return

    const scrollbarWidth = window.innerWidth - body.offsetWidth

    if (scrollbarWidth > 0) {
      createStyle({
        element: body,
        style: {},
        properties: [
          { key: '--scrollbar-width', value: `${scrollbarWidth}px` },
        ],
      })
    }

    if (access(defaultedProps.preventScrollbarShift) && scrollbarWidth > 0) {
      const offsetTop = window.scrollY
      const offsetLeft = window.scrollX

      createStyle({
        element: body,
        style: {
          paddingRight: `calc(${
            window.getComputedStyle(body).paddingRight
          } + ${scrollbarWidth}px)`,
        },
        cleanup: () => {
          if (isIOS()) return
          window.scrollTo(offsetLeft, offsetTop)
        },
      })
    }

    if (isIOS()) {
      if (body.style.position === 'fixed') return

      const offsetTop = window.scrollY
      const offsetLeft = window.scrollX

      createStyle({
        element: body,
        style: {
          position: 'fixed',
          overflow: 'hidden',
          top: `-${offsetTop}px`,
          left: `-${offsetLeft}px`,
        },
        cleanup: () => {
          window.scrollTo(offsetLeft, offsetTop)
        },
      })
    } else {
      if (body.style.overflow === 'hidden') return

      createStyle({
        element: body,
        style: {
          overflow: 'hidden',
        },
      })
    }
  })
}

export default createDisableScroll
