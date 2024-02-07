import { DefaultBreakpoint } from '@primitives/drawer'

export type ResolvedSnapPoint = {
  value: string | number
  offset: number
}

type ResolvedSnapPointWithBreakPoints = ResolvedSnapPoint & {
  upperBreakPoint?: number
  lowerBreakPoint?: number
}

/**
 * Converts snap and break points into offsets that can be used to apply the translate value to the drawer.
 *
 * @param snapPoint - The snap point to resolve.
 * @param drawerSize - The size of the drawer.
 * @param index - The index of the snap point in the list of snap points.
 * @param breakPoints - The list of break points.
 * @returns The resolved snap point.
 */
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

/**
 * Converts a snap or break point into an offset that can be used to apply the translate value to the drawer.
 * @param point - The snap or break point to resolve.
 * @param drawerSize - The size of the drawer.
 * @returns The resolved snap or break point.
 * @throws If the point is not a number or a string ending with 'px'.
 *
 */
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

/**
 * Find the closest snap point to the given offset.
 * @param snapPoints - The snap points to search through.
 * @param offset - The current offset.
 * @param offsetWithVelocity - The current offset with the velocity applied.
 */
export const findClosestSnapPoint = (
  snapPoints: ResolvedSnapPointWithBreakPoints[],
  offset: number,
  offsetWithVelocity: number,
  allowSkippingSnapPoints: boolean,
) => {
  // Find the closest snap point above the given offset.
  const upperSnapPoint = findNearbySnapPoint(
    'upper',
    snapPoints,
    allowSkippingSnapPoints ? offsetWithVelocity : offset,
  )
  // Find the closest snap point below the given offset.
  const lowerSnapPoint = findNearbySnapPoint(
    'lower',
    snapPoints,
    allowSkippingSnapPoints ? offsetWithVelocity : offset,
  )

  // If there is only one snap point, return it.
  if (!upperSnapPoint) return lowerSnapPoint!
  if (!lowerSnapPoint) return upperSnapPoint

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

/**
 * Find either the closest snap point above or under the given offset.
 * @param side - Whether to find the closest snap point above or under the given offset.
 * @param snapPoints - The snap points to search through.
 * @param offset - The current offset.
 */
const findNearbySnapPoint = (
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

/**
 * Returns true if the given location is draggable.
 * An element is draggable if:
 * - The target element and all of its parents don't have the `data-corvu-no-drag` attribute present.
 * - The target element is not an input of type range.
 *
 * @param location - The HTMLElement to check.
 * @param stopAt - The HTMLElement to stop at when searching up the tree. Defaults to the body element.
 * @returns Whether the location is draggable.
 */
export const locationIsDraggable = (
  location: HTMLElement,
  stopAt?: HTMLElement,
) => {
  let currentElement: HTMLElement | null = location

  let stopReached = false

  do {
    if (
      currentElement.hasAttribute('data-corvu-no-drag') ||
      (currentElement as HTMLInputElement).type === 'range'
    )
      return false

    if (currentElement === (stopAt ?? document.documentElement)) {
      stopReached = true
    } else {
      currentElement = currentElement.parentElement
    }
  } while (currentElement && !stopReached)

  return true
}
