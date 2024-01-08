import type { Axis } from '@lib/types'

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

  return overflow === 'auto' || overflow === 'scroll'
}

/**
 * Returns true if the given element is scrollable on the given axis. Scrollable elements are scroll containers that have `clientSize` < `scrollSize`.
 *
 * @param element - The element to check.
 * @param axis - The axis to check for.
 * @returns Whether the element is scrollable.
 */
const isScrollable = (element: HTMLElement, axis: Axis | 'both') => {
  if (!isScrollContainer(element, axis)) return false

  if (axis === 'both') {
    const scrollDimensionsX = getScrollDimensions(element, 'x')
    const scrollDimensionsY = getScrollDimensions(element, 'y')
    if (
      scrollDimensionsX[0] < scrollDimensionsX[2] ||
      scrollDimensionsY[0] < scrollDimensionsY[2]
    )
      return true
  } else {
    const scrollDimensions = getScrollDimensions(element, axis)
    if (scrollDimensions[0] < scrollDimensions[2]) return true
  }

  return false
}

/**
 * Returns true if the given location is scrollable on the given axis.
 *
 * @param location - The HTMLElement to check.
 * @param axis - The axis to check for.
 * @param stopAt - The HTMLElement to stop at when searching up the tree for scrollable elements. Defaults to the body element.
 * @returns Whether the location is scrollable.
 */
const locationIsScrollable = (
  location: HTMLElement,
  axis: Axis | 'both',
  stopAt?: HTMLElement,
) => {
  let currentElement: HTMLElement | null = location

  let stopReached = false

  do {
    if (isScrollable(currentElement, axis)) return true

    if (currentElement === (stopAt ?? document.body)) {
      stopReached = true
    } else {
      currentElement = currentElement.parentElement
    }
  } while (currentElement && !stopReached)

  return false
}

/**
 * Returns all scrollable elements at the given location.
 *
 * @param location - The HTMLElement to check.
 * @param axis - The axis to check for.
 * @param stopAt - The HTMLElement to stop at when searching up the tree for scrollable elements. Defaults to the body element.
 * @returns A list of all scrollable elements at the given location.
 */
const getScrollablesAtLocation = (
  location: HTMLElement,
  axis: Axis | 'both',
  stopAt?: HTMLElement,
) => {
  let currentElement: HTMLElement | null = location

  let stopReached = false

  const scrollables = []

  do {
    if (isScrollable(currentElement, axis)) {
      scrollables.push(currentElement)
    }

    if (currentElement === (stopAt ?? document.body)) {
      stopReached = true
    } else {
      currentElement = currentElement.parentElement
    }
  } while (currentElement && !stopReached)

  return scrollables
}

/**
 * Returns the total scroll available at the given location.
 *
 * @param location - The HTMLElement to check.
 * @param axis - The axis to check for.
 * @param stopAt - The HTMLElement to stop at when searching up the tree for scrollable elements. Defaults to the body element.
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
    if (currentElement === (stopAt ?? document.body)) {
      wrapperReached = true
    } else {
      currentElement = currentElement.parentElement
    }
  } while (currentElement && !wrapperReached)

  return [availableScroll, availableScrollTop] as [number, number]
}

export {
  getScrollDimensions,
  isScrollContainer,
  isScrollable,
  locationIsScrollable,
  getScrollablesAtLocation,
  getScrollAtLocation,
}
