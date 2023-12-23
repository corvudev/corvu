import createStyle from '@lib/create/style'
import { access } from '@lib/utils'
import { createEffect, mergeProps } from 'solid-js'
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

    createStyle({
      element: body,
      style: {
        pointerEvents: 'none',
        userSelect: 'none',
      },
    })
  })
}

export default createNoPointerEvents
