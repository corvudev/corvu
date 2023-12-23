import { type Accessor, createEffect, mergeProps, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

const createOutsidePointerDown = (props: {
  onPointerDown: (event: PointerEvent) => void
  enabled?: MaybeAccessor<boolean>
  element: Accessor<HTMLElement | null>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
    },
    props,
  )

  createEffect(() => {
    if (!access(defaultedProps.enabled)) {
      return
    }
    document.addEventListener('pointerdown', handlePointerDown)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handlePointerDown)
    })
  })

  const handlePointerDown = (event: PointerEvent) => {
    const element = defaultedProps.element()
    if (element && !element.contains(event.target as Node)) {
      defaultedProps.onPointerDown(event)
    }
  }
}

export default createOutsidePointerDown
