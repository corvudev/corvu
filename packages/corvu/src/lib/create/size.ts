import { createEffect, createSignal, onCleanup } from 'solid-js'
import { access } from '@corvu/utils'
import type { MaybeAccessor } from 'solid-presence'

const createSize = (props: {
  element: MaybeAccessor<HTMLElement | null>
  dimension: MaybeAccessor<'width' | 'height'>
}) => {
  const [size, setSize] = createSignal(0)

  createEffect(() => {
    const element = access(props.element)
    if (!element) return

    syncSize(element)

    const observer = new ResizeObserver(resizeObserverCallback)
    observer.observe(element)
    onCleanup(() => {
      observer.disconnect()
    })
  })

  const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.target !== access(props.element)) continue
      syncSize(entry.target as HTMLElement)
    }
  }

  const syncSize = (element: HTMLElement) => {
    switch (access(props.dimension)) {
      case 'width':
        setSize(element.offsetWidth)
        break
      case 'height':
        setSize(element.offsetHeight)
        break
    }
  }

  return size
}

export default createSize
