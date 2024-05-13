import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'
import type { Side, Size } from '@corvu/utils'
import type { ResolvedSnapPoint } from '@src/lib'

export type DrawerContextValue = {
  /** An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values. */
  snapPoints: Accessor<Size[]>
  /** Breakpoints between snap points. */
  breakPoints: Accessor<(Size | null)[]>
  /** The point to snap to when the drawer opens. */
  defaultSnapPoint: Accessor<Size>
  /** The active snap point. */
  activeSnapPoint: Accessor<Size>
  /** Change the active snap point. */
  setActiveSnapPoint: (snapPoint: Size) => void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging. */
  side: Accessor<Side>
  /** Whether the drawer is currently being dragged by the user. */
  isDragging: Accessor<boolean>
  /** Whether the drawer is currently transitioning to a snap point after the user stopped dragging or the drawer opens/closes. */
  isTransitioning: Accessor<boolean>
  /** The transition state that the drawer is currently in. */
  transitionState: Accessor<
    'opening' | 'closing' | 'snapping' | 'resizing' | null
  >
  /** How much the drawer is currently open. Can be > 1 depending on your `dampFunction`. */
  openPercentage: Accessor<number>
  /** The current translate value applied to the drawer. Is the same for every side. */
  translate: Accessor<number>
  /** After how many milliseconds the cached distance used for the velocity function should reset. */
  velocityCacheReset: Accessor<number>
  /** Whether the user can skip snap points if the velocity is high enough. */
  allowSkippingSnapPoints: Accessor<boolean>
  /** Whether the logic to handle dragging on scrollable elements is enabled. */
  handleScrollableElements: Accessor<boolean>
  /** Whether the drawer watches for size changes and applies a fixed width/height for transitions. */
  transitionResize: Accessor<boolean>
}

const DrawerContext = createContext<DrawerContextValue>()

export const createDrawerContext = (contextId?: string) => {
  if (contextId === undefined) return DrawerContext

  const context = createKeyedContext<DrawerContextValue>(`drawer-${contextId}`)
  return context
}

/** Context which exposes various properties to interact with the drawer. Optionally provide a contextId to access a keyed context. */
export const useDrawerContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(DrawerContext)
    if (!context) {
      throw new Error(
        '[corvu]: Drawer context not found. Make sure to wrap Drawer components in <Drawer.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<DrawerContextValue>(`drawer-${contextId}`)
  if (!context) {
    throw new Error(
      `[corvu]: Drawer context with id "${contextId}" not found. Make sure to wrap Drawer components in <Drawer.Root contextId="${contextId}">`,
    )
  }
  return context
}

type InternalDrawerContextValue = DrawerContextValue & {
  dampFunction: (distance: number) => number
  velocityFunction: (distance: number, time: number) => number
  setIsDragging: (isDragging: boolean) => void
  setTranslate: (translate: number) => void
  drawerSize: Accessor<number>
  resolvedActiveSnapPoint: Accessor<ResolvedSnapPoint>
  drawerStyles: Accessor<CSSStyleDeclaration | undefined>
  setTransitionState: Setter<
    'opening' | 'closing' | 'snapping' | 'resizing' | null
  >
  transitionSize: Accessor<number | null>
  closeDrawer: () => void
}

const InternalDrawerContext = createContext<InternalDrawerContextValue>()

export const createInternalDrawerContext = (contextId?: string) => {
  if (contextId === undefined) return InternalDrawerContext

  const context = createKeyedContext<InternalDrawerContextValue>(
    `drawer-internal-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the drawer. Optionally provide a contextId to access a keyed context. */
export const useInternalDrawerContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalDrawerContext)
    if (!context) {
      throw new Error(
        '[corvu]: Drawer context not found. Make sure to wrap Drawer components in <Drawer.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalDrawerContextValue>(
    `drawer-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Drawer context with id "${contextId}" not found. Make sure to wrap Drawer components in <Drawer.Root contextId="${contextId}">`,
    )
  }
  return context
}
