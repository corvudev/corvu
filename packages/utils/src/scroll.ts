import type { Axis } from '@src/types'

/**
 * Returns the scroll dimensions of the given element on the given axis.
 *
 * @param element - The element to check.
 * @param axis - The axis to check for.
 * @returns The scroll dimensions of the element. `[clientSize, scrollOffset, scrollSize]`
 */
const getScrollDimensions = (
  element: HTMLElement,
  axis: Axis,
): [number, number, number] => {
  switch (axis) {
    case 'x':
      return [element.clientWidth, element.scrollLeft, element.scrollWidth]
    case 'y':
      return [element.clientHeight, element.scrollTop, element.scrollHeight]
  }
}

/**
 * Returns true if the given element is a scroll container on the given axis. Scroll containers are elements with `overflow` set to `auto` or `scroll`.
 *
 * @param element - The element to check.
 * @param axis - The axis to check for.
 * @returns Whether the element is a scroll container.
 */
const isScrollContainer = (element: HTMLElement, axis: Axis | 'both') => {
  const styles = getComputedStyle(element)
  const overflow = axis === 'x' ? styles.overflowX : styles.overflowY

  return (
    overflow === 'auto' ||
    overflow === 'scroll' ||
    // The HTML element is a scroll container if it has overflow visible
    (element.tagName === 'HTML' && overflow === 'visible')
  )
}

/**
 * Returns the total scroll available at the given location.
 *
 * @param location - The HTMLElement to check.
 * @param axis - The axis to check for.
 * @param stopAt - The HTMLElement to stop at when searching up the tree for scrollable elements. Defaults to the body element. Works with SolidJS portals by using their `_$host` property.
 * @returns The total scroll available at the given location. `[availableScroll, availableScrollTop]`
 */
const getScrollAtLocation = (
  location: HTMLElement,
  axis: Axis,
  stopAt?: HTMLElement,
) => {
  const directionFactor =
    axis === 'x' && window.getComputedStyle(location).direction === 'rtl'
      ? -1
      : 1

  let currentElement: HTMLElement | null = location
  let availableScroll = 0
  let availableScrollTop = 0
  let wrapperReached = false

  do {
    const [clientSize, scrollOffset, scrollSize] = getScrollDimensions(
      currentElement,
      axis,
    )

    const scrolled = scrollSize - clientSize - directionFactor * scrollOffset

    if (
      (scrollOffset !== 0 || scrolled !== 0) &&
      isScrollContainer(currentElement, axis)
    ) {
      availableScroll += scrolled
      availableScrollTop += scrollOffset
    }
    if (currentElement === (stopAt ?? document.documentElement)) {
      wrapperReached = true
    } else {
      // @ts-expect-error: _$host is a custom SolidJS property
      currentElement = currentElement._$host ?? currentElement.parentElement
    }
  } while (currentElement && !wrapperReached)

  return [availableScroll, availableScrollTop] as [number, number]
}

export { getScrollAtLocation }
