import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import {
  type Accessor,
  batch,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
} from 'solid-js'
import { afterPaint } from '@corvu/utils/dom'

/**
 * Utility that uses a `ResizeObserver` to provide the size of an element before and after resize. Used to transition the width/height of elements that don't have a fixed size applied.
 *
 * @param props.element - The element to transition.
 * @param props.enabled - Whether the utility is enabled. *Default = `true`*
 * @param props.dimension - The dimension to transition. *Default = `'both'`*
 * @returns ```typescript
 * {
 *   transitioning: () => boolean
 *   transitionSize: () => number | [number, number] | null
 * }
 * ```
 */
function createTransitionSize(props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  dimension?: MaybeAccessor<'both'>
}): {
  transitioning: Accessor<boolean>
  transitionSize: Accessor<[number, number] | null>
}
function createTransitionSize(props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  dimension: MaybeAccessor<'width' | 'height'>
}): {
  transitioning: Accessor<boolean>
  transitionSize: Accessor<number | null>
}
function createTransitionSize(props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  dimension?: MaybeAccessor<'width' | 'height' | 'both'>
}): {
  transitioning: Accessor<boolean>
  transitionSize: Accessor<number | [number, number] | null>
} {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      dimension: 'both' as const,
    },
    props,
  )

  const [transitioning, setTransitioning] = createSignal(false)
  const [transitionSize, setTransitionSize] = createSignal<
    number | [number, number] | null
  >(null)

  let startSize: [number, number] | null = null

  createEffect(() => {
    const element = access(defaultedProps.element)
    const enabled = access(defaultedProps.enabled)
    if (!element || !enabled) return

    const observer = new ResizeObserver(resizeObserverCallback)
    observer.observe(element)

    element.addEventListener('transitionend', reset)
    onCleanup(() => {
      observer.disconnect()
      element.removeEventListener('transitionend', reset)
      reset()
    })
  })

  const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
    if (transitioning()) return
    for (const entry of entries) {
      const target = entry.target as HTMLElement
      if (target !== access(defaultedProps.element)) continue
      const currentSize: [number, number] = [
        target.offsetWidth,
        target.offsetHeight,
      ]
      const dimension = access(defaultedProps.dimension)
      if (dimension === 'both') {
        if (!startSize) {
          startSize = currentSize
        } else if (
          startSize[0] !== currentSize[0] &&
          startSize[1] !== currentSize[1]
        ) {
          batch(() => {
            setTransitionSize(startSize)
            setTransitioning(true)
          })
          afterPaint(() => {
            setTransitionSize(currentSize)
            const transitionDuration = parseFloat(
              getComputedStyle(entry.target).transitionDuration,
            )
            if (transitionDuration === 0) {
              reset()
            }
          })
        }
      } else {
        if (!startSize) {
          startSize = currentSize
        } else if (
          getSizeOfDimension(dimension, startSize) !==
          getSizeOfDimension(dimension, currentSize)
        ) {
          batch(() => {
            setTransitionSize(getSizeOfDimension(dimension, startSize!))
            setTransitioning(true)
          })
          afterPaint(() => {
            setTransitionSize(getSizeOfDimension(dimension, currentSize))
            const transitionDuration = parseFloat(
              getComputedStyle(entry.target).transitionDuration,
            )
            if (transitionDuration === 0) {
              reset()
            }
          })
        }
      }
    }
  }

  const reset = () => {
    if (!transitioning()) return
    const element = access(defaultedProps.element)
    if (element) {
      startSize = [element.offsetWidth, element.offsetHeight]
    } else {
      startSize = null
    }
    batch(() => {
      setTransitioning(false)
      setTransitionSize(null)
    })
  }

  return {
    transitioning,
    transitionSize,
  }
}

const getSizeOfDimension = (
  dimension: 'width' | 'height',
  size: [number, number],
) => {
  switch (dimension) {
    case 'width':
      return size[0]
    case 'height':
      return size[1]
  }
}

export default createTransitionSize
