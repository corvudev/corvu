/**!
 * Part of this code is taken from and inspired by solid-primitives.
 * MIT License, Copyright (c) Solid Core Team
 *
 * https://github.com/solidjs-community/solid-primitives
 */
import type { EventHandlerEvent } from '@src/dom'
import { isFunction } from '@src/assertions'
import type { JSX } from 'solid-js'

const extractCSSregex = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

function stringStyleToObject(style: string): JSX.CSSProperties {
  const object: Record<string, string> = {}
  let match: RegExpExecArray | null
  while ((match = extractCSSregex.exec(style))) {
    object[match[1]!] = match[2]!
  }
  return object
}

function combineStyle(
  a: JSX.CSSProperties,
  b: JSX.CSSProperties | string | undefined,
): JSX.CSSProperties | string {
  if (typeof b === 'string') {
    b = stringStyleToObject(b)
  }
  return { ...a, ...b }
}

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

export { afterPaint, callEventHandler, combineStyle, sortByDocumentPosition }
