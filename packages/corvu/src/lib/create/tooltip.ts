import { createEffect, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

type Point = { x: number; y: number }

const createTooltip = (props: {
  trigger: MaybeAccessor<HTMLElement | null>
  content: MaybeAccessor<HTMLElement | null>
  openOnFocus: MaybeAccessor<boolean>
  openOnHover: MaybeAccessor<boolean>
  closeOnPointerDown: MaybeAccessor<boolean>
  closeOnScroll: MaybeAccessor<boolean>
  hoverableContent: MaybeAccessor<boolean>
  openDelay: MaybeAccessor<number>
  closeDelay: MaybeAccessor<number>
  skipDelayDuration: MaybeAccessor<number>
  onHover?: (event: PointerEvent) => void
  onLeave?: (event: PointerEvent) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onPointerDown?: (event: PointerEvent) => void
  onScroll?: (event: Event) => void
}) => {
  let tooltipState: 'focus' | 'hover' | null = null

  let timeout: number | null = null
  let skipDelay = false
  let skipDelayTimeout: number | null = null
  let insideSafeArea = false

  createEffect(() => {
    if (!access(props.openOnHover)) return
    const trigger = access(props.trigger)
    if (!trigger) return

    const onPointerEnter = (event: PointerEvent) => openTooltip('hover', event)
    const onPointerDown = (event: PointerEvent) => closeTooltip('click', event)
    const onPointerLeave = (event: PointerEvent) => {
      if (tooltipState === 'hover') return
      closeTooltip('leave', event)
    }

    trigger.addEventListener('pointerenter', onPointerEnter)
    trigger.addEventListener('pointerdown', onPointerDown)
    trigger.addEventListener('pointerleave', onPointerLeave)

    onCleanup(() => {
      trigger.removeEventListener('pointerenter', onPointerEnter)
      trigger.removeEventListener('pointerdown', onPointerDown)
      trigger.removeEventListener('pointerleave', onPointerLeave)
    })
  })

  createEffect(() => {
    if (!access(props.openOnFocus)) return
    const trigger = access(props.trigger)
    if (!trigger) return

    const onFocus = (event: FocusEvent) => openTooltip('focus', event)

    const onBlur = (event: FocusEvent) => closeTooltip('blur', event)

    trigger.addEventListener('focus', onFocus)
    trigger.addEventListener('blur', onBlur)
    onCleanup(() => {
      trigger.removeEventListener('focus', onFocus)
      trigger.removeEventListener('blur', onBlur)
    })
  })

  createEffect(() => {
    if (!access(props.hoverableContent)) return
    const content = access(props.content)
    if (!content) return

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      if (tooltipState !== 'focus') return
      tooltipState = 'hover'
    }

    content.addEventListener('pointerdown', onPointerDown)
    onCleanup(() => {
      content.removeEventListener('pointerdown', onPointerDown)
    })
  })

  const openTooltip = (
    reason: 'focus' | 'hover',
    event: FocusEvent | PointerEvent,
  ) => {
    resetTimeout()

    switch (reason) {
      case 'focus':
        tooltipState = 'focus'
        props.onFocus?.(event)
        insideSafeArea = true
        if (access(props.closeOnScroll)) {
          document.addEventListener('scroll', onScroll, { capture: true })
        }
        document.addEventListener('pointermove', onSafeAreaMove)
        break

      case 'hover':
        const pointerEvent = event as PointerEvent
        if (pointerEvent.pointerType === 'touch') return
        if (tooltipState === 'focus' || tooltipState === 'hover') return

        const openDelay = access(props.openDelay)
        if (openDelay <= 0 || skipDelay) {
          tooltipState = 'hover'
          props.onHover?.(pointerEvent)
          insideSafeArea = true
          if (access(props.closeOnScroll)) {
            document.addEventListener('scroll', onScroll, { capture: true })
          }
          document.addEventListener('pointermove', onSafeAreaMove)
        } else {
          timeout = setTimeout(() => {
            timeout = null
            tooltipState = 'hover'
            props.onHover?.(pointerEvent)
            insideSafeArea = true
            if (access(props.closeOnScroll)) {
              document.addEventListener('scroll', onScroll, { capture: true })
            }
            document.addEventListener('pointermove', onSafeAreaMove)
          }, openDelay)
        }
        break
    }
  }

  const closeTooltip = (
    reason: 'blur' | 'leave' | 'click' | 'scroll',
    event: FocusEvent | PointerEvent | Event,
  ) => {
    resetTimeout()

    switch (reason) {
      case 'blur':
        if (insideSafeArea) {
          tooltipState = 'hover'
          return
        }
        tooltipState = null
        props.onBlur?.(event as FocusEvent)
        break

      case 'leave':
        if (tooltipState !== 'hover') return

        const closeDelay = access(props.closeDelay)
        if (closeDelay <= 0 || skipDelay) {
          initSkipDelay()
          tooltipState = null
          props.onLeave?.(event as PointerEvent)
        } else {
          timeout = setTimeout(() => {
            timeout = null
            if (insideSafeArea) return
            initSkipDelay()
            tooltipState = null
            props.onLeave?.(event as PointerEvent)
          }, closeDelay)
        }
        break

      case 'click':
        if (!access(props.closeOnPointerDown)) return
        tooltipState = null
        props.onPointerDown?.(event as PointerEvent)
        break

      case 'scroll':
        tooltipState = null
        props.onScroll?.(event)
        break
    }
  }

  const onSafeAreaMove = (event: PointerEvent) => {
    const points = []

    const trigger = access(props.trigger)
    if (!trigger) return
    points.push(...getPointsFromRect(trigger.getBoundingClientRect()))

    if (access(props.hoverableContent)) {
      const content = access(props.content)
      if (content) {
        points.push(...getPointsFromRect(content.getBoundingClientRect()))
      }
    }

    const safeAreaPolygon = calculateSafeAreaPolygon(points)

    if (tooltipState === null) {
      document.removeEventListener('pointermove', onSafeAreaMove)
      return
    }

    if (
      !pointInPolygon({ x: event.clientX, y: event.clientY }, safeAreaPolygon)
    ) {
      if (insideSafeArea && tooltipState === 'hover') {
        insideSafeArea = false
        closeTooltip('leave', event)
      } else {
        insideSafeArea = false
      }
    } else {
      insideSafeArea = true
    }
  }

  const onScroll = (event: Event) => {
    const trigger = access(props.trigger)

    if (tooltipState === null || !trigger) {
      document.removeEventListener('scroll', onScroll)
      return
    }

    if (!(event.target as HTMLElement).contains(trigger)) return

    closeTooltip('scroll', event)
  }

  const resetTimeout = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  const initSkipDelay = () => {
    const skipDelayDuration = access(props.skipDelayDuration)
    if (skipDelayDuration > 0) {
      if (skipDelayTimeout) {
        clearTimeout(skipDelayTimeout)
        skipDelayTimeout = null
      }
      skipDelay = true
      setTimeout(() => {
        skipDelayTimeout = null
        skipDelay = false
      }, skipDelayDuration)
    }
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

export default createTooltip
