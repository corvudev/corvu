import {
  batch,
  type Component,
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  splitProps,
  untrack,
} from 'solid-js'
import {
  createDrawerContext,
  createInternalDrawerContext,
} from '@primitives/drawer/Context'
import DialogRoot, {
  type DialogRootChildrenProps,
  type DialogRootProps,
} from '@primitives/dialog/Root'
import {
  type InternalDialogContextValue,
  useInternalDialogContext,
} from '@primitives/dialog/Context'
import createControllableSignal from '@lib/create/controllableSignal'
import createOnce from '@lib/create/once'
import { createWritableMemo } from '@solid-primitives/memo'
import { isFunction } from '@lib/assertions'
import { resolveSnapPoint } from '@primitives/drawer/lib'
import type { Side } from '@lib/types'
import { sleep } from '@lib/utils'

/** Alternative placeholder to not override a certain breakpoint. */
export const DefaultBreakpoint = undefined

export type DrawerRootProps = {
  /** An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values. *Default = `[0, 1]`* */
  snapPoints?: (string | number)[]
  /** Optionally override the default breakpoints between snap points. This list has to be the length of `snapPoints.length - 1`. Use `Drawer.DefaultBreakpoint` or `undefined` for breakpoints you don't want to override. *Default = `[Drawer.DefaultBreakpoint]`* */
  breakPoints?: (string | number | typeof DefaultBreakpoint)[]
  /** The point to snap to when the drawer opens. *Default = `1`* */
  defaultSnapPoint?: string | number
  /** The active snap point. */
  activeSnapPoint?: string | number
  /** Callback fired when the active snap point changes. */
  onActiveSnapPointChange?(activeSnapPoint: string | number): void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging. *Default = `'bottom'`* */
  side?: Side
  /** Function to create a dampened distance if the user tries to drag the drawer away from the last snap point. */
  dampFunction?(distance: number): number
  /** Function to calculate the velocity when the user stop dragging. This velocity modifier is used to calculate the point the drawer will snap to after release. You can disable velocity by always returning 1. */
  velocityFunction?(distance: number, time: number): number
  /** After how many milliseconds the cached distance used for the velocity function should reset. *Default = `200`* */
  velocityCacheReset?: number
  /** Whether the user can skip snap points if the velocity is high enough. *Default = `true`* */
  allowSkippingSnapPoints?: boolean
  /** Corvu drawers have logic to make dragging and scrolling work together. If you don't want this behavior or if you want to implement something yourself, you can disable it with this property. *Default = `true`* */
  handleScrollableElements?: boolean
  children:
    | JSX.Element
    | ((
        props: DrawerRootChildrenProps & DialogRootChildrenProps,
      ) => JSX.Element)
} & Omit<DialogRootProps, 'children'>

/** Props which are passed to the Root component children function. */
export type DrawerRootChildrenProps = {
  /** An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values. */
  snapPoints: (string | number)[]
  /** Breakpoints between snap points. */
  breakPoints: (string | number | typeof DefaultBreakpoint)[]
  /** The point to snap to when the drawer opens. */
  defaultSnapPoint: string | number
  /** The active snap point. */
  activeSnapPoint: string | number
  /** Set the current active snap point. */
  setActiveSnapPoint(snapPoint: string | number): void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging. */
  side: Side
  /** Whether the drawer is currently being dragged by the user. */
  isDragging: boolean
  /** Whether the drawer is currently transitioning to a snap point after the user stopped dragging or the drawer opens/closes. */
  isTransitioning: boolean
  /** The transition state that the drawer is currently in. */
  transitionState: 'opening' | 'closing' | 'snapping' | null
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
}

/** Context wrapper for the drawer. Is required for every drawer you create. */
const DrawerRoot: Component<DrawerRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      initialOpen: false,
      snapPoints: [0, 1],
      breakPoints: [DefaultBreakpoint],
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
    'open',
    'initialOpen',
    'onOpenChange',
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

  const [isDragging, setIsDragging] = createSignal(false)
  const [transitionState, setTransitionState] = createSignal<
    'opening' | 'closing' | 'snapping' | null
  >(null)

  const drawerStyles = createMemo(() => {
    const contentRef = dialogContext()?.contentRef()
    if (!contentRef) return undefined
    return getComputedStyle(contentRef)
  })

  const [drawerSize, setDrawerSize] = createSignal(0)

  createEffect(() => {
    const element = dialogContext()?.contentRef()
    if (!element) return

    const observer = new ResizeObserver(resizeObserverCallback)
    observer.observe(element)
    onCleanup(() => {
      observer.disconnect()
    })
  })

  const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.target !== dialogContext()?.contentRef()) continue
      switch (localProps.side) {
        case 'top':
        case 'bottom':
          setDrawerSize(entry.target.clientHeight)
          break
        case 'left':
        case 'right':
          setDrawerSize(entry.target.clientWidth)
          break
      }
    }
  }

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

  const onOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true)
      // eslint-disable-next-line solid/reactivity
      sleep(0).then(() => {
        batch(() => {
          setTransitionState('opening')
          setActiveSnapPoint(localProps.defaultSnapPoint)
        })
        const transitionDuration =
          parseFloat(drawerStyles()!.transitionDuration) * 1000
        if (transitionDuration === 0) {
          batch(() => {
            setTransitionState(null)
          })
        }
      })
    } else if (transitionState() === 'closing') {
      batch(() => {
        setOpen(false)
      })
    } else {
      batch(() => {
        setTransitionState('closing')
        setActiveSnapPoint(0)
      })
      const transitionDuration =
        parseFloat(drawerStyles()!.transitionDuration) * 1000
      if (transitionDuration === 0) {
        setOpen(false)
        setTransitionState(null)
      }
    }
  }

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
            dampFunction: localProps.dampFunction,
            velocityFunction: localProps.velocityFunction,
            setIsDragging,
            setTranslate,
            drawerSize,
            resolvedActiveSnapPoint,
            drawerStyles,
            setTransitionState,
          }}
        >
          <DialogRoot
            open={open()}
            onOpenChange={onOpenChange}
            contextId={localProps.contextId}
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
