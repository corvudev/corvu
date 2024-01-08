/**!
 * Part of this code is inspired by react-remove-scroll.
 * MIT License, Copyright (c) Anton Korzunov
 *
 * https://github.com/theKashey/react-remove-scroll
 */

import { access, sleep } from '@lib/utils'
import type { Axis, MaybeAccessor } from '@lib/types'
import {
  createEffect,
  createSignal,
  createUniqueId,
  mergeProps,
  onCleanup,
} from 'solid-js'
import { getScrollAtLocation, locationIsScrollable } from '@lib/scroll'
import createStyle from '@lib/create/style'

const [disableScrollStack, setDisableScrollStack] = createSignal<string[]>([])
const isActive = (id: string) =>
  disableScrollStack().indexOf(id) === disableScrollStack().length - 1

/**
 * Disables scroll outside of the given element.
 *
 * @param props.element Disable scroll outside of this element.
 * @param props.enabled Whether scroll should be disabled. *Default = `true`*
 * @param props.hideScrollbar Whether the scrollbar of the `<body>` element should be hidden. *Default = `true`*
 * @param props.preventScrollbarShift Whether padding should be added to the `<body>` element to avoid layout shift. *Default = `true`*
 * @param props.preventScrollbarShiftMode Whether padding or margin should be used to avoid layout shift. *Default = `'padding'`*
 * @param props.allowPinchZoom Whether pinch zoom should be allowed. *Default = `false`*
 */
const createDisableScroll = (props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  hideScrollbar?: MaybeAccessor<boolean>
  preventScrollbarShift?: MaybeAccessor<boolean>
  preventScrollbarShiftMode?: MaybeAccessor<'padding' | 'margin'>
  allowPinchZoom?: MaybeAccessor<boolean>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      hideScrollbar: true,
      preventScrollbarShift: true,
      preventScrollbarShiftMode: 'padding',
      allowPinchZoom: false,
    },
    props,
  )

  const disableScrollId = createUniqueId()

  const currentEvents: {
    type: string
    delta: [number, number]
    target: HTMLElement
    shouldCancel: boolean
  }[] = []
  let currentTouchStart: [number, number] = [0, 0]
  let currentTouchStartAxis: Axis | null = null
  let currentTouchStartDelta: number | null = null

  createEffect(() => {
    if (!access(defaultedProps.enabled)) return

    setDisableScrollStack((stack) => [...stack, disableScrollId])

    onCleanup(() => {
      setDisableScrollStack((stack) =>
        stack.filter((id) => id !== disableScrollId),
      )
    })
  })

  createEffect(() => {
    const element = access(defaultedProps.element)

    if (
      !element ||
      !access(defaultedProps.enabled) ||
      !access(defaultedProps.hideScrollbar)
    )
      return

    const { body } = document

    const scrollbarWidth = window.innerWidth - body.offsetWidth

    if (scrollbarWidth === 0) return

    const style: Partial<CSSStyleDeclaration> = {
      overflow: 'hidden',
    }
    const properties: {
      key: string
      value: string
    }[] = []

    if (access(defaultedProps.preventScrollbarShift) && scrollbarWidth > 0) {
      if (access(defaultedProps.preventScrollbarShiftMode) === 'padding') {
        style.paddingRight = `calc(${
          window.getComputedStyle(body).paddingRight
        } + ${scrollbarWidth}px)`
      } else {
        style.marginRight = `calc(${
          window.getComputedStyle(body).marginRight
        } + ${scrollbarWidth}px)`
      }

      properties.push({
        key: '--scrollbar-width',
        value: `${scrollbarWidth}px`,
      })
    }

    const offsetTop = window.scrollY
    const offsetLeft = window.scrollX

    createStyle({
      element: body,
      style,
      properties,
      cleanup: () => {
        window.scrollTo(offsetLeft, offsetTop)
      },
    })
  })

  createEffect(() => {
    const element = access(defaultedProps.element)

    if (
      !isActive(disableScrollId) ||
      !element ||
      !access(defaultedProps.enabled)
    )
      return

    document.addEventListener('wheel', maybePreventScroll, { passive: false })
    document.addEventListener('touchmove', maybePreventTouch, {
      passive: false,
    })
    document.addEventListener('touchstart', logTouchStart, { passive: false })

    element.addEventListener('scroll', scrollCapture, { capture: true })
    element.addEventListener('wheel', scrollCapture, { capture: true })
    element.addEventListener('touchmove', touchMoveCapture, { capture: true })

    onCleanup(() => {
      document.removeEventListener('wheel', maybePreventScroll)
      document.removeEventListener('touchmove', maybePreventTouch)
      document.removeEventListener('touchstart', logTouchStart)

      element.removeEventListener('scroll', scrollCapture, { capture: true })
      element.removeEventListener('wheel', scrollCapture, { capture: true })
      element.removeEventListener('touchmove', touchMoveCapture, {
        capture: true,
      })
    })
  })

  const logTouchStart = (event: TouchEvent) => {
    currentTouchStart = getTouchXY(event)
    currentTouchStartAxis = null
    currentTouchStartDelta = null
  }

  const scrollCapture = (event: Event | WheelEvent) => {
    const wrapper = access(defaultedProps.element)!

    const delta = getDeltaXY(event as WheelEvent)

    const axis: Axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? 'x' : 'y'

    let shouldCancel: boolean

    if (!locationIsScrollable(event.target as HTMLElement, axis, wrapper)) {
      shouldCancel = true
    } else {
      shouldCancel = handleScroll(
        access(defaultedProps.element)!,
        event.target as HTMLElement,
        axis === 'x' ? delta[0] : delta[1],
        axis,
      )
    }

    recordCurrentEvent(event, getDeltaXY(event as WheelEvent), shouldCancel)
  }

  const touchMoveCapture = (event: TouchEvent) => {
    const wrapper = access(defaultedProps.element)!
    const target = event.target as HTMLElement

    let shouldCancel: boolean

    // Two touch points = pinch zoom
    if (event.touches.length === 2) {
      shouldCancel = !access(defaultedProps.allowPinchZoom)
    } else {
      if (currentTouchStartAxis == null || currentTouchStartDelta === null) {
        const delta = getTouchXY(event).map(
          (touch, i) => currentTouchStart[i]! - touch,
        ) as [number, number]
        const axis: Axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? 'x' : 'y'

        currentTouchStartAxis = axis
        currentTouchStartDelta = axis === 'x' ? delta[0] : delta[1]
      }

      // Allow touch on range inputs
      if ((target as HTMLInputElement).type === 'range') {
        shouldCancel = false
      } else if (
        !locationIsScrollable(target, currentTouchStartAxis, wrapper)
      ) {
        shouldCancel = true
      } else {
        shouldCancel = handleScroll(
          access(defaultedProps.element)!,
          event.target as HTMLElement,
          currentTouchStartDelta,
          currentTouchStartAxis,
        )
      }
    }

    recordCurrentEvent(event, getTouchXY(event), shouldCancel)
  }

  const recordCurrentEvent = (
    event: Event,
    delta: [number, number],
    shouldCancel: boolean,
  ) => {
    const currentEvent = {
      type: event.type,
      delta,
      target: event.target as HTMLElement,
      shouldCancel,
    }
    currentEvents.push(currentEvent)
    sleep(0).then(() => {
      const index = currentEvents.indexOf(currentEvent)
      if (index === -1) return
      currentEvents.splice(index, 1)
    })
  }

  const maybePreventScroll = (event: WheelEvent) =>
    maybePrevent(event, getDeltaXY(event))
  const maybePreventTouch = (event: TouchEvent) =>
    maybePrevent(event, getTouchXY(event))

  const maybePrevent = (event: Event, delta: [number, number]) => {
    const sourceEvent = currentEvents.find(
      (currentEvent) =>
        currentEvent.type === event.type &&
        currentEvent.target === event.target &&
        deltaEquals(currentEvent.delta, delta),
    )

    if (!sourceEvent || (sourceEvent && sourceEvent.shouldCancel)) {
      if (event.cancelable) {
        event.preventDefault()
      }
    }
  }
}

const getDeltaXY = (event: WheelEvent): [number, number] => [
  event.deltaX,
  event.deltaY,
]

const getTouchXY = (event: TouchEvent): [number, number] =>
  event.changedTouches[0]
    ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY]
    : [0, 0]

const deltaEquals = (a: [number, number], b: [number, number]) =>
  a[0] === b[0] && a[1] === b[1]

const handleScroll = (
  wrapper: HTMLElement,
  target: HTMLElement,
  delta: number,
  axis: Axis,
) => {
  const targetInWrapper = wrapper.contains(target)

  const [availableScroll, availableScrollTop] = getScrollAtLocation(
    target,
    axis,
    targetInWrapper ? wrapper : undefined,
  )

  // On firefox, availableScroll can be 1 even if there is no scroll available.
  if (delta > 0 && Math.abs(availableScroll) <= 1) {
    return true
  } else if (delta < 0 && Math.abs(availableScrollTop) < 1) {
    return true
  }

  return false
}

export default createDisableScroll
