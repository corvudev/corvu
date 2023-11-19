import { access } from '@lib/utils'
import { Accessor, createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createOutsidePointerDown = (props: {
  onPointerDown: (event: PointerEvent) => void
  isDisabled?: MaybeAccessor<boolean>
  element: Accessor<HTMLElement | null>
}) => {
  createEffect(() => {
    if (access(props.isDisabled)) {
      return
    }
    document.addEventListener('pointerdown', handlePointerDown)

    onCleanup(() => {
      document.removeEventListener('pointerdown', handlePointerDown)
    })
  })

  const handlePointerDown = (event: PointerEvent) => {
    const element = props.element()
    if (element && !element.contains(event.target as Node)) {
      props.onPointerDown(event)
    }
  }
}

export default createOutsidePointerDown
