import { DefaultBreakpoint } from '@primitives/drawer'

export type ResolvedSnapPoint = {
  value: string | number
  offset: number
}

type ResolvedSnapPointWithBreakPoints = ResolvedSnapPoint & {
  upperBreakPoint?: number
  lowerBreakPoint?: number
}

/** Converts snap and break points into offsets that can be used to apply the translate value to the drawer. */
export const resolveSnapPoint = (
  snapPoint: string | number,
  drawerSize: number,
  index?: number,
  breakPoints?: (string | number | typeof DefaultBreakpoint)[],
): ResolvedSnapPointWithBreakPoints => {
  if (index === undefined || breakPoints === undefined) {
    return {
      value: snapPoint,
      offset: resolvePoint(snapPoint, drawerSize),
    }
  }

  const upperBreakPoint = breakPoints[index - 1]
    ? resolvePoint(breakPoints[index - 1]!, drawerSize)
    : undefined

  const lowerBreakPoint = breakPoints[index]
    ? resolvePoint(breakPoints[index]!, drawerSize)
    : undefined

  return {
    value: snapPoint,
    offset: resolvePoint(snapPoint, drawerSize),
    lowerBreakPoint,
    upperBreakPoint,
  }
}

export const resolvePoint = (
  point: number | string,
  drawerSize: number,
): number => {
  if (typeof point === 'number') return drawerSize - point * drawerSize
  if (!point.endsWith('px')) {
    throw new Error(
      `[corvu] Snap and break points must be a number or a string ending with 'px'. Got ${point}`,
    )
  }
  return drawerSize - parseInt(point, 10)
}

/** Find the closest snap point to the given offset. */
export const findClosestSnapPoint = (
  snapPoints: ResolvedSnapPointWithBreakPoints[],
  offset: number,
  offsetWithVelocity: number,
  allowSkippingSnapPoints: boolean,
) => {
  // Find the closest snap point above the given offset.
  const upperSnapPoint = findNearbySnapPoints(
    'upper',
    snapPoints,
    allowSkippingSnapPoints ? offsetWithVelocity : offset,
  )
  // Find the closest snap point below the given offset.
  const lowerSnapPoint = findNearbySnapPoints(
    'lower',
    snapPoints,
    allowSkippingSnapPoints ? offsetWithVelocity : offset,
  )

  // If there is only one snap point, return it.
  if (!upperSnapPoint) return lowerSnapPoint as ResolvedSnapPointWithBreakPoints
  if (!lowerSnapPoint) return upperSnapPoint as ResolvedSnapPointWithBreakPoints

  // If there are no custom break points, return the closest snap point.
  if (
    lowerSnapPoint.upperBreakPoint === undefined ||
    upperSnapPoint.lowerBreakPoint === undefined
  ) {
    return Math.abs(lowerSnapPoint.offset - offsetWithVelocity) <
      Math.abs(upperSnapPoint.offset - offsetWithVelocity)
      ? lowerSnapPoint
      : upperSnapPoint
  }

  return offsetWithVelocity < upperSnapPoint.lowerBreakPoint
    ? lowerSnapPoint
    : upperSnapPoint
}

/** Find either the closest snap point above or under the given offset. */
const findNearbySnapPoints = (
  side: 'upper' | 'lower',
  snapPoints: ResolvedSnapPointWithBreakPoints[],
  offset: number,
) => {
  return snapPoints.reduce(
    (
      previousSnapPoint: ResolvedSnapPointWithBreakPoints | undefined,
      currentSnapPoint,
    ) => {
      if (
        side == 'upper' &&
        currentSnapPoint.offset >= offset &&
        (!previousSnapPoint ||
          currentSnapPoint.offset < previousSnapPoint.offset)
      ) {
        return currentSnapPoint
      } else if (
        side == 'lower' &&
        currentSnapPoint.offset <= offset &&
        (!previousSnapPoint ||
          currentSnapPoint.offset > previousSnapPoint.offset)
      ) {
        return currentSnapPoint
      }
      return previousSnapPoint
    },
    undefined,
  )
}

export const targetIsScrollable = (
  targetElement: HTMLElement,
  direction: 'y' | 'x',
) => {
  let currentElement: HTMLElement | null = targetElement
  while (currentElement) {
    if (isScrollable(currentElement, direction)) {
      return true
    }

    if (currentElement.dataset.corvuDialogContent === '') return false

    currentElement = currentElement.parentElement
  }
  return false
}

export const targetIsScrolled = (
  targetElement: HTMLElement,
  side: 'top' | 'right' | 'bottom' | 'left',
) => {
  let currentElement: HTMLElement | null = targetElement
  while (currentElement) {
    switch (side) {
      case 'top':
        if (
          isScrollable(currentElement, sideToDirection(side)) &&
          currentElement.scrollTop !==
            currentElement.scrollHeight - currentElement.clientHeight
        )
          return true
        break
      case 'right':
        if (
          isScrollable(currentElement, sideToDirection(side)) &&
          currentElement.scrollLeft !== 0
        )
          return true
        break
      case 'bottom':
        if (
          isScrollable(currentElement, sideToDirection(side)) &&
          currentElement.scrollTop !== 0
        )
          return true
        break
      case 'left':
        if (
          isScrollable(currentElement, sideToDirection(side)) &&
          currentElement.scrollLeft !==
            currentElement.scrollWidth - currentElement.clientWidth
        )
          return true
        break
    }

    if (currentElement.dataset.corvuDialogContent === '') return false

    currentElement = currentElement.parentElement
  }
  return false
}

const isScrollable = (element: HTMLElement, direction: 'y' | 'x') => {
  switch (direction) {
    case 'y':
      return (
        getComputedStyle(element).overflowY !== 'visible' &&
        element.scrollHeight > element.clientHeight
      )
    case 'x':
      return (
        getComputedStyle(element).overflowX !== 'visible' &&
        element.scrollWidth > element.clientWidth
      )
  }
}

export const getScrollables = (element: HTMLElement) => {
  const scrollables = []

  let currentElement: HTMLElement | null = element
  while (currentElement) {
    if (
      getComputedStyle(currentElement).overflowY !== 'visible' &&
      (currentElement.scrollHeight > currentElement.clientHeight ||
        currentElement.scrollWidth > currentElement.clientWidth)
    ) {
      scrollables.push(currentElement)
    }
    if (currentElement.dataset.corvuDialogContent === '') {
      return scrollables
    }

    currentElement = currentElement.parentElement
  }
  return scrollables
}

export const sideToDirection = (
  side: 'top' | 'right' | 'bottom' | 'left',
): 'y' | 'x' => {
  switch (side) {
    case 'top':
    case 'bottom':
      return 'y'
    case 'right':
    case 'left':
      return 'x'
  }
}
