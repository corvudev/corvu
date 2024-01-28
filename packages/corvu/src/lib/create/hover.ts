import {
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  untrack,
} from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

const POINT_PADDING = 5

type Point = { x: number; y: number }

/**
 * Handles hovering between two elements (called `trigger` and `content`). Create a safe area between them to allow the cursor to move between them without triggering the `onLeave` callback.
 *
 * @param props.enabled Whether the hover utility is enabled. *Default = `true`*
 * @param props.trigger The trigger element.
 * @param props.content The content element.
 * @param props.hoverableContent Whether the content element should be hoverable. *Default = `true`*
 * @param props.enterDelay The delay before the hover is considered entered. *Default = `0`*
 * @param props.leaveDelay The delay before the hover is considered left. *Default = `0`*
 * @param props.skipDelayDuration The duration while the enterDelay should be ignored after `onLeave` got called. *Default = `0`*
 * @param props.onTriggerEnter A callbCallback fired when the trigger is entered.
 * @param props.onContentEnter A callback fired when the content is entered.
 * @param props.onLeave A callback fired when the hover is left.
 */
const createHover = (props: {
  enabled?: MaybeAccessor<boolean>
  trigger: MaybeAccessor<HTMLElement | null>
  content: MaybeAccessor<HTMLElement | null>
  hoverableContent?: MaybeAccessor<boolean>
  enterDelay?: MaybeAccessor<number>
  leaveDelay?: MaybeAccessor<number>
  skipDelayDuration?: MaybeAccessor<number>
  onTriggerEnter?(event: MouseEvent): void
  onContentEnter?(event: MouseEvent): void
  onLeave?(event: MouseEvent): void
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      hoverableContent: true,
      enterDelay: 0,
      leaveDelay: 0,
      skipDelayDuration: 0,
    },
    props,
  )

  const [hoverState, setHoverState] = createSignal<
    'idle' | 'timeout' | 'trigger' | 'safeArea' | 'content'
  >('idle')

  let timeout: number | null = null
  let skipDelay = false
  let safeAreaPolygon: Point[] | null = null

  createEffect(() => {
    if (!access(defaultedProps.enabled)) return
    const trigger = access(defaultedProps.trigger)
    if (!trigger) return

    const onPointerEnter = (event: PointerEvent) => {
      const enterDelay = access(defaultedProps.enterDelay)
      trigger.addEventListener('pointerleave', onPointerLeave, { once: true })
      if (enterDelay <= 0 || skipDelay || hoverState() !== 'idle') {
        initPointerEnter(event)
      } else {
        setHoverState('timeout')
        timeout = setTimeout(() => initPointerEnter(event), enterDelay)
      }
    }

    const initPointerEnter = (event: PointerEvent) => {
      setHoverState('trigger')
      defaultedProps.onTriggerEnter?.(event)
    }

    const onPointerLeave = (e: PointerEvent) => {
      const content = access(defaultedProps.content)
      if (!access(defaultedProps.hoverableContent) || !content) {
        setHoverState('idle')
        return
      }
      safeAreaPolygon = calculateSafeAreaPolygon([
        ...padPoint({ x: e.clientX, y: e.clientY }, POINT_PADDING),
        ...getPointsFromRect(content.getBoundingClientRect()),
      ])
      setHoverState('safeArea')
    }

    trigger.addEventListener('pointerenter', onPointerEnter)
    onCleanup(() => {
      setHoverState('idle')
      trigger.removeEventListener('pointerenter', onPointerEnter)
    })
  })

  createEffect(() => {
    if (!access(defaultedProps.enabled)) return
    if (!access(defaultedProps.hoverableContent)) return
    const content = access(defaultedProps.content)
    if (!content) return

    const onPointerEnter = (event: PointerEvent) => {
      setHoverState('content')
      defaultedProps.onContentEnter?.(event)
      content.addEventListener('pointerleave', onPointerLeave, { once: true })
    }

    const onPointerLeave = (e: PointerEvent) => {
      const trigger = access(defaultedProps.trigger)
      if (!trigger) {
        setHoverState('idle')
        return
      }
      safeAreaPolygon = calculateSafeAreaPolygon([
        ...padPoint({ x: e.clientX, y: e.clientY }, POINT_PADDING),
        ...getPointsFromRect(trigger.getBoundingClientRect()),
      ])
      setHoverState('safeArea')
    }

    content.addEventListener('pointerenter', onPointerEnter)
    onCleanup(() => {
      setHoverState('idle')
      content.removeEventListener('pointerenter', onPointerEnter)
    })
  })

  createEffect(() => {
    timeout && clearTimeout(timeout)
    let skipDelayTimeout: number
    if (hoverState() === 'idle') {
      untrack(() => {
        const skipDelayDuration = access(defaultedProps.skipDelayDuration)
        if (skipDelayDuration <= 0) return
        skipDelay = true
        skipDelayTimeout = setTimeout(() => {
          skipDelay = false
        }, skipDelayDuration)
      })
    }

    if (hoverState() !== 'safeArea') return

    document.addEventListener('pointermove', onSafeAreaMove)

    onCleanup(() => {
      skipDelayTimeout && clearTimeout(skipDelayTimeout)
      safeAreaPolygon = null
      document.removeEventListener('pointermove', onSafeAreaMove)
    })
  })

  const onSafeAreaMove = (event: PointerEvent) => {
    const trigger = access(defaultedProps.trigger)
    const content = access(defaultedProps.content)
    if (!trigger || !content) {
      setHoverState('idle')
      return
    }
    if (trigger.contains(event.target as Node)) {
      setHoverState('trigger')
      return
    }
    if (content.contains(event.target as Node)) {
      setHoverState('content')
      return
    }

    if (
      !pointInPolygon({ x: event.clientX, y: event.clientY }, safeAreaPolygon!)
    ) {
      const leaveDelay = access(defaultedProps.leaveDelay)
      if (leaveDelay <= 0) {
        leave(event)
      } else {
        setHoverState('timeout')
        timeout = setTimeout(() => leave(event), leaveDelay)
      }
    }
  }

  const leave = (event: PointerEvent) => {
    setHoverState('idle')
    defaultedProps.onLeave?.(event)
  }
}

const getPointsFromRect = (rect: DOMRect) => {
  return [
    { x: rect.left, y: rect.top },
    { x: rect.left, y: rect.bottom },
    { x: rect.right, y: rect.top },
    { x: rect.right, y: rect.bottom },
  ]
}

const padPoint = (point: Point, padding: number) => {
  return [
    { x: point.x - padding, y: point.y - padding },
    { x: point.x - padding, y: point.y + padding },
    { x: point.x + padding, y: point.y - padding },
    { x: point.x + padding, y: point.y + padding },
  ]
}

const pointInPolygon = (point: Point, polygon: Point[]) => {
  let inside = false
  for (let p1 = 0, p2 = polygon.length - 1; p1 < polygon.length; p2 = p1++) {
    const x1 = polygon[p1]!.x,
      y1 = polygon[p1]!.y,
      x2 = polygon[p2]!.x,
      y2 = polygon[p2]!.y

    if (
      point.y < y1 !== point.y < y2 &&
      point.x < x1 + ((point.y - y1) / (y2 - y1)) * (x2 - x1)
    ) {
      inside = !inside
    }
  }
  return inside
}

// Convex hull algorithm
// See: https://www.nayuki.io/page/convex-hull-algorithm
const calculateSafeAreaPolygon = (points: Point[]) => {
  points.sort((a, b) => {
    if (a.x < b.x) return -1
    else if (a.x > b.x) return +1
    else if (a.y < b.y) return -1
    else if (a.y > b.y) return +1
    else return 0
  })
  if (points.length <= 1) return points

  const upperHull: Point[] = []
  for (const p of points) {
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1]!
      const r = upperHull[upperHull.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
        upperHull.pop()
      } else break
    }
    upperHull.push(p)
  }
  upperHull.pop()

  const lowerHull: Point[] = []

  for (let pointIndex = points.length - 1; pointIndex >= 0; pointIndex--) {
    const p = points[pointIndex]!
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1]!
      const r = lowerHull[lowerHull.length - 2]!
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) {
        lowerHull.pop()
      } else break
    }
    lowerHull.push(p)
  }
  lowerHull.pop()

  if (
    upperHull.length == 1 &&
    lowerHull.length == 1 &&
    upperHull[0]!.x == lowerHull[0]!.x &&
    upperHull[0]!.y == lowerHull[0]!.y
  ) {
    return upperHull
  } else {
    return upperHull.concat(lowerHull)
  }
}

export default createHover
