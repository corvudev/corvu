import { createEffect, mergeProps } from 'solid-js'
import { access } from '@lib/utils'
import createStyle from '@lib/create/style'
import type { MaybeAccessor } from '@lib/types'

/**
 * Disables pointer events on the `<body>` element.
 *
 * @param props.enabled - Whether pointer events should be disabled. * Default = `true`*
 */
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

    createStyle({
      element: body,
      style: {
        pointerEvents: 'none',
      },
    })
  })
}

export default createNoPointerEvents
