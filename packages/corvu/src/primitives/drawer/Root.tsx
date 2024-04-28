import {
  batch,
  type Component,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  splitProps,
  untrack,
} from 'solid-js'
import {
  createDrawerContext,
  createInternalDrawerContext,
} from '@primitives/drawer/context'
import DialogRoot, {
  type DialogRootChildrenProps,
  type DialogRootProps,
} from '@primitives/dialog/Root'
import {
  type InternalDialogContextValue,
  useInternalDialogContext,
} from '@primitives/dialog/context'
import type { Side, Size } from '@lib/types'
import { afterPaint } from '@corvu/utils'
import createControllableSignal from '@lib/create/controllableSignal'
import createOnce from '@lib/create/once'
import createSize from '@lib/create/size'
import createTransitionSize from 'solid-transition-size'
import { createWritableMemo } from '@solid-primitives/memo'
import { isFunction } from '@lib/assertions'
import { resolveSnapPoint } from '@primitives/drawer/lib'

export type DrawerRootProps = {
  /**
   * An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values.
   * @defaultValue `[0, 1]`
   */
  snapPoints?: Size[]
  /**
   * Optionally override the default breakpoints between snap points. This list has to be the length of `snapPoints.length - 1`. Provide `null` for breakpoints you don't want to override.
   */
  breakPoints?: (Size | null)[]
  /**
   * The point to snap to when the drawer opens.
   * @defaultValue `1`
   */
  defaultSnapPoint?: Size
  /**
   * The active snap point.
   */
  activeSnapPoint?: Size
  /**
   * Callback fired when the active snap point changes.
   */
  onActiveSnapPointChange?: (activeSnapPoint: Size) => void
  /**
   * The side of the viewport the drawer appears. Is used to properly calculate dragging.
   * @defaultValue `'bottom'`
   */
  side?: Side
  /**
   * Function to create a dampened distance if the user tries to drag the drawer away from the last snap point.
   */
  dampFunction?: (distance: number) => number
  /**
   * Function to calculate the velocity when the user stop dragging. This velocity modifier is used to calculate the point the drawer will snap to after release. You can disable velocity by always returning 1
   */
  velocityFunction?: (distance: number, time: number) => number
  /**
   * After how many milliseconds the cached distance used for the velocity function should reset.
   * @defaultValue `200`
   */
  velocityCacheReset?: number
  /**
   * Whether the user can skip snap points if the velocity is high enough.
   * @defaultValue `true`
   */
  allowSkippingSnapPoints?: boolean
  /**
   * corvu drawers have logic to make dragging and scrolling work together. If you don't want this behavior or if you want to implement something yourself, you can disable it with this property.
   * @defaultValue `true`
   */
  handleScrollableElements?: boolean
  /**
   * Whether the drawer should watch for size changes and apply a fixed width/height for transitions.
   * @defaultValue `false`
   */
  transitionResize?: boolean
  children:
    | JSX.Element
    | ((
        props: DrawerRootChildrenProps & DialogRootChildrenProps,
      ) => JSX.Element)
} & Omit<DialogRootProps, 'children'>

/** Props that are passed to the Root component children callback. */
export type DrawerRootChildrenProps = {
  /** An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values. */
  snapPoints: Size[]
  /** Breakpoints between snap points. */
  breakPoints: (Size | null)[]
  /** The point to snap to when the drawer opens. */
  defaultSnapPoint: Size
  /** The active snap point. */
  activeSnapPoint: Size
  /** Set the current active snap point. */
  setActiveSnapPoint: (snapPoint: Size) => void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging. */
  side: Side
  /** Whether the drawer is currently being dragged by the user. */
  isDragging: boolean
  /** Whether the drawer is currently transitioning to a snap point after the user stopped dragging or the drawer opens/closes. */
  isTransitioning: boolean
  /** The transition state that the drawer is currently in. */
  transitionState: 'opening' | 'closing' | 'snapping' | 'resizing' | null
  /** How much the drawer is currently open. Can be > 1 depending on your `dampFunction`. */
  openPercentage: number
  /** The current translate value applied to the drawer. Is the same for every side. */
  translate: number
  /** After how many milliseconds the cached distance used for the velocity function should reset. */
  velocityCacheReset: number
  /** Whether the user can skip snap points if the velocity is high enough. */
  allowSkippingSnapPoints: boolean
  /** Whether the logic to handle dragging on scrollable elements is enabled. */
  handleScrollableElements: boolean
  /** Whether the drawer watches for size changes and applies a fixed width/height for transitions. */
  transitionResize: boolean
}

/** Context wrapper for the drawer. Is required for every drawer you create. */
const DrawerRoot: Component<DrawerRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      initialOpen: false,
      snapPoints: [0, 1],
      breakPoints: [null],
      defaultSnapPoint: 1,
      side: 'bottom' as const,
      dampFunction: (distance: number) => 6 * Math.log(distance + 1),
      velocityFunction: (distance: number, time: number) => {
        const velocity = distance / time
        return velocity < 1 && velocity > -1 ? 1 : velocity
      },
      velocityCacheReset: 200,
      allowSkippingSnapPoints: true,
      handleScrollableElements: true,
      transitionResize: false,
      closeOnOutsidePointer: true,
      allowPinchZoom: false,
    },
    props,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'snapPoints',
    'breakPoints',
    'defaultSnapPoint',
    'activeSnapPoint',
    'onActiveSnapPointChange',
    'side',
    'dampFunction',
    'velocityFunction',
    'velocityCacheReset',
    'allowSkippingSnapPoints',
    'handleScrollableElements',
    'transitionResize',
    'open',
    'initialOpen',
    'onOpenChange',
    'closeOnOutsidePointer',
    'contextId',
    'children',
  ])

  const [open, setOpen] = createControllableSignal({
    value: () => localProps.open,
    initialValue: localProps.initialOpen,
    onChange: localProps.onOpenChange,
  })

  const [activeSnapPoint, setActiveSnapPoint] = createControllableSignal({
    value: () => localProps.activeSnapPoint,
    initialValue: 0,
    onChange: localProps.onActiveSnapPointChange,
  })

  const [dialogContext, setDialogContext] =
    createSignal<InternalDialogContextValue>()

  const { transitioning: sizeTransitioning, transitionSize } =
    createTransitionSize({
      element: () => dialogContext()?.contentRef() ?? null,
      enabled: () => open() && localProps.transitionResize,
      dimension: () => {
        switch (localProps.side) {
          case 'top':
          case 'bottom':
            return 'height'
          case 'left':
          case 'right':
            return 'width'
        }
      },
    })

  const [isDragging, setIsDragging] = createSignal(false)
  const [transitionState, setTransitionState] = createWritableMemo<
    'opening' | 'closing' | 'snapping' | 'resizing' | null
  >(() => {
    if (sizeTransitioning()) return 'resizing'
    return null
  })

  const drawerStyles = createMemo(() => {
    const contentRef = dialogContext()?.contentRef()
    if (!contentRef) return undefined
    return getComputedStyle(contentRef)
  })

  const [transitionAwareOpen, setTransitionAwareOpen] = createSignal(false)

  createEffect(() => {
    const _open = open()

    untrack(() => {
      if (transitionAwareOpen() === _open) {
        return
      }

      if (_open) {
        setTransitionAwareOpen(true)
        // eslint-disable-next-line solid/reactivity
        afterPaint(() => {
          batch(() => {
            setTransitionState('opening')
            setActiveSnapPoint(localProps.defaultSnapPoint)
          })
          const transitionDuration = parseFloat(
            drawerStyles()!.transitionDuration,
          )
          if (transitionDuration === 0) {
            setTransitionState(null)
          }
        })
      } else {
        batch(() => {
          setTransitionState('closing')
          setActiveSnapPoint(0)
        })
        // eslint-disable-next-line solid/reactivity
        afterPaint(() => {
          const transitionDuration = parseFloat(
            drawerStyles()!.transitionDuration,
          )
          if (transitionDuration === 0) {
            closeDrawer()
          }
        })
      }
    })
  })

  const closeDrawer = () => {
    batch(() => {
      setTransitionAwareOpen(false)
      setTransitionState(null)
    })
  }

  const drawerSize = createSize({
    element: () => dialogContext()?.contentRef() ?? null,
    dimension: () => {
      switch (localProps.side) {
        case 'top':
        case 'bottom':
          return 'height'
        case 'left':
        case 'right':
          return 'width'
      }
    },
  })

  const resolvedActiveSnapPoint = createMemo(() =>
    resolveSnapPoint(activeSnapPoint(), drawerSize()),
  )
  const [translate, setTranslate] = createWritableMemo(
    () => resolvedActiveSnapPoint().offset,
  )
  const openPercentage = createMemo(() => {
    if (!drawerSize()) return 0
    return (drawerSize() - translate()) / drawerSize()
  })

  const childrenProps: DrawerRootChildrenProps = {
    get snapPoints() {
      return localProps.snapPoints
    },
    get breakPoints() {
      return localProps.breakPoints
    },
    get defaultSnapPoint() {
      return localProps.defaultSnapPoint
    },
    get activeSnapPoint() {
      return activeSnapPoint()
    },
    setActiveSnapPoint,
    get side() {
      return localProps.side
    },

    get isDragging() {
      return isDragging()
    },
    get isTransitioning() {
      return transitionState() !== null
    },
    get transitionState() {
      return transitionState()
    },
    get openPercentage() {
      return openPercentage()
    },
    get translate() {
      return translate()
    },
    get velocityCacheReset() {
      return localProps.velocityCacheReset
    },
    get allowSkippingSnapPoints() {
      return localProps.allowSkippingSnapPoints
    },
    get handleScrollableElements() {
      return localProps.handleScrollableElements
    },
    get transitionResize() {
      return localProps.transitionResize
    },
  }

  const memoizedChildren = createOnce(() => localProps.children)

  const resolveChildren = (dialogChildrenProps: DialogRootChildrenProps) => {
    setDialogContext(useInternalDialogContext(localProps.contextId))

    const children = memoizedChildren()()
    if (isFunction(children)) {
      const mergedProps = mergeProps(dialogChildrenProps, childrenProps)
      return children(mergedProps)
    }
    return children
  }

  const memoizedDrawerRoot = createMemo(() => {
    const DrawerContext = createDrawerContext(localProps.contextId)
    const InternalDrawerContext = createInternalDrawerContext(
      localProps.contextId,
    )

    return untrack(() => (
      <DrawerContext.Provider
        value={{
          snapPoints: () => localProps.snapPoints,
          breakPoints: () => localProps.breakPoints,
          defaultSnapPoint: () => localProps.defaultSnapPoint,
          activeSnapPoint,
          setActiveSnapPoint,
          side: () => localProps.side,
          isDragging,
          isTransitioning: () => transitionState() !== null,
          transitionState,
          openPercentage,
          translate,
          velocityCacheReset: () => localProps.velocityCacheReset,
          allowSkippingSnapPoints: () => localProps.allowSkippingSnapPoints,
          handleScrollableElements: () => localProps.handleScrollableElements,
          transitionResize: () => localProps.transitionResize,
        }}
      >
        <InternalDrawerContext.Provider
          value={{
            snapPoints: () => localProps.snapPoints,
            breakPoints: () => localProps.breakPoints,
            defaultSnapPoint: () => localProps.defaultSnapPoint,
            activeSnapPoint,
            setActiveSnapPoint,
            side: () => localProps.side,
            isDragging,
            isTransitioning: () => transitionState() !== null,
            transitionState,
            openPercentage,
            translate,
            velocityCacheReset: () => localProps.velocityCacheReset,
            allowSkippingSnapPoints: () => localProps.allowSkippingSnapPoints,
            handleScrollableElements: () => localProps.handleScrollableElements,
            transitionResize: () => localProps.transitionResize,
            dampFunction: localProps.dampFunction,
            velocityFunction: localProps.velocityFunction,
            setIsDragging,
            setTranslate,
            drawerSize,
            resolvedActiveSnapPoint,
            drawerStyles,
            setTransitionState,
            transitionSize,
            closeDrawer,
          }}
        >
          <DialogRoot
            open={transitionAwareOpen()}
            onOpenChange={setOpen}
            contextId={localProps.contextId}
            closeOnOutsidePointer={
              !isDragging() && localProps.closeOnOutsidePointer
            }
            {...otherProps}
          >
            {(dialogChildrenProps) => resolveChildren(dialogChildrenProps)}
          </DialogRoot>
        </InternalDrawerContext.Provider>
      </DrawerContext.Provider>
    ))
  })

  return memoizedDrawerRoot as unknown as JSX.Element
}

export default DrawerRoot
