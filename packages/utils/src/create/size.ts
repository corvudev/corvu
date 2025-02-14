import { access, type MaybeAccessor } from '@src/reactivity'
import { createEffect, createSignal } from 'solid-js'

const createSize = (props: {
  element: MaybeAccessor<HTMLElement | null>
  dimension: MaybeAccessor<'width' | 'height'>
}) => {
  const [size, setSize] = createSignal(0)

  createEffect(
    () => [access(props.element)],
    ([element]) => {
      if (!element) return

      syncSize(element)

      const observer = new ResizeObserver(resizeObserverCallback)
      observer.observe(element)
      return () => {
        observer.disconnect()
      }
    },
  )

  const resizeObserverCallback = ([entry]: ResizeObserverEntry[]) => {
    syncSize(entry!.target as HTMLElement)
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
