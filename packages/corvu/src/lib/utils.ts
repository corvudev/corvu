/**!
 * Part of this code is taken from and inspired by solid-primitives.
 * MIT License, Copyright (c) Solid Core Team
 *
 * https://github.com/solidjs-community/solid-primitives
 */

import { type Accessor, createMemo, type JSX } from 'solid-js'
import type { Alignment, Side } from '@floating-ui/dom'
import type {
  EventHandlerEvent,
  MaybeAccessor,
  MaybeAccessorValue,
} from '@lib/types'
import type { FloatingState } from '@lib/create/floating'
import { isFunction } from '@lib/assertions'

const callEventHandler = <T, E extends Event>(
  eventHandler: JSX.EventHandlerUnion<T, E> | undefined,
  event: EventHandlerEvent<T, E>,
) => {
  if (eventHandler) {
    if (isFunction(eventHandler)) {
      eventHandler(event)
    } else {
      eventHandler[0](eventHandler[1], event)
    }
  }

  return event.defaultPrevented
}

const access = <T extends MaybeAccessor<unknown>>(
  v: T,
): MaybeAccessorValue<T> => (typeof v === 'function' ? v() : v)

const some = (...signals: Accessor<unknown>[]) => {
  return signals.some((signal) => !!signal())
}

const chain = <Args extends [] | unknown[]>(callbacks: {
  [Symbol.iterator](): IterableIterator<
    ((...args: Args) => unknown) | undefined
  >
}): ((...args: Args) => void) => {
  return (...args: Args) => {
    for (const callback of callbacks) callback && callback(...args)
  }
}

const mergeRefs = <T>(
  ...refs: (((val: T) => void) | undefined)[]
): ((el: T) => void) => {
  return chain(refs)
}

const dataIf = (condition: boolean) => (condition ? '' : undefined)

const afterPaint = (fn: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(fn))

const getFloatingStyle = (props: {
  strategy: MaybeAccessor<'absolute' | 'fixed'>
  floatingState: MaybeAccessor<FloatingState>
}) => {
  const memoizedFloatingStyle = createMemo(() => {
    const strategy = access(props.strategy)
    const floatingState = access(props.floatingState)

    const side = floatingState.placement.split('-')[0] as Side
    const alignment = floatingState.placement.split('-')[1] as
      | Alignment
      | undefined

    let transformOrigin
    switch (floatingState.placement) {
      case 'top':
      case 'bottom':
        transformOrigin = `${alignment ? alignment : 'center'} ${PositionToDirection[side]}`
      case 'left':
      case 'right':
        transformOrigin = `${PositionToDirection[side]} ${alignment ? alignment : 'center'}`
    }

    return {
      position: strategy,
      top: `${floatingState.y}px`,
      left: `${floatingState.x}px`,
      width:
        floatingState.width !== null ? `${floatingState.width}px` : undefined,
      height:
        floatingState.height !== null ? `${floatingState.height}px` : undefined,
      'max-width':
        floatingState.maxWidth !== null
          ? `${floatingState.maxWidth}px`
          : undefined,
      'max-height':
        floatingState.maxHeight !== null
          ? `${floatingState.maxHeight}px`
          : undefined,
      '--corvu-floating-transform-origin': transformOrigin,
    }
  })

  return memoizedFloatingStyle
}

const PositionToDirection = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

export {
  callEventHandler,
  access,
  some,
  chain,
  mergeRefs,
  dataIf,
  afterPaint,
  getFloatingStyle,
  PositionToDirection,
}
