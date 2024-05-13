import type { EventHandlerEvent } from '@src/dom'
import { isFunction } from '@src/assertions'
import type { JSX } from 'solid-js'

const afterPaint = (fn: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(fn))

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

const sortByDocumentPosition = (a: HTMLElement, b: HTMLElement) => {
  const relativePosition = a.compareDocumentPosition(b)
  if (
    relativePosition & Node.DOCUMENT_POSITION_PRECEDING ||
    relativePosition & Node.DOCUMENT_POSITION_CONTAINS
  ) {
    return 1
  }
  if (
    relativePosition & Node.DOCUMENT_POSITION_FOLLOWING ||
    relativePosition & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1
  }
  return 0
}

export { afterPaint, callEventHandler, sortByDocumentPosition }
