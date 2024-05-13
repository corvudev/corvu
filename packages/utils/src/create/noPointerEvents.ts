import { access, type MaybeAccessor } from '@src/reactivity'
import { createEffect, mergeProps } from 'solid-js'
import createStyle from '@src/create/style'

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
      key: 'no-pointer-events',
      element: body,
      style: {
        pointerEvents: 'none',
      },
    })
  })
}

export default createNoPointerEvents
