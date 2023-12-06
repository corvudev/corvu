import { isFunction } from '@lib/assertions'
import createControllableSignal from '@lib/create/controllableSignal'
import createOnce from '@lib/create/once'
import { resolveSnapPoint } from '@lib/drawer'
import {
  InternalDialogContextValue,
  useInternalDialogContext,
} from '@primitives/dialog/DialogContext'
import DialogRoot, {
  DialogRootChildrenProps,
  DialogRootProps,
} from '@primitives/dialog/DialogRoot'
import {
  createDrawerContext,
  createInternalDrawerContext,
} from '@primitives/drawer/DrawerContext'
import { createWritableMemo } from '@solid-primitives/memo'
import {
  Component,
  JSX,
  batch,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  splitProps,
  untrack,
} from 'solid-js'

/** Alternative placeholder to not override a certain breakpoint. */
export const DefaultBreakpoint = undefined

export type DrawerRootProps = {
  /** An array of points to snap to. Can be either percentages of the total drawer height or CSS pixel values.
   * @defaultValue [0, 1]
   */
  snapPoints?: (string | number)[]
  /** Optionally override the default breakpoints between snap points. This list has to be the length of `snapPoints.length - 1`. Use `Drawer.DefaultBreakpoint` or `undefined` for breakpoints you don't want to override.
   * @defaultValue [Drawer.DefaultBreakpoint]
   */
  breakPoints?: (string | number | typeof DefaultBreakpoint)[]
  /** The point to snap to when the drawer opens.
   * @defaultValue 1
   */
  defaultSnapPoint?: string | number
  /** The active snap point. */
  activeSnapPoint?: string | number
  /** Callback fired when the active snap point changes. */
  onActiveSnapPointChange?(activeSnapPoint: string | number): void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging.
   * @defaultValue 'bottom'
   */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Function to create a dampened distance if the user tries to drag the drawer away from the last snap point.
   * @defaultValue `(distance: number) => 6 * Math.log(distance + 1)`
   */
  dampFunction?(distance: number): number
  /** Function to calculate the velocity when the user stop dragging. This velocity modifier is used to calculate the point the drawer will snap to after release. You can disable velocity by always returning 1. */
  velocityFunction?(distance: number, time: number): number
  /** After how many milliseconds the cached distance used for the velocity function should reset.
   * @defaultValue 200
   */
  velocityCacheReset?: number
  /** Whether the user can skip snap points if the velocity is high enough.
   * @defaultValue true
   */
  allowSkippingSnapPoints?: boolean
  /** Corvu drawers have logic to make dragging and scrolling work together. If you don't want this behavior or if you want to implement something yourself, you can disable it with this property.
   * @defaultValue true
   */
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
  snapPoints?: (string | number)[]
  /** Breakpoints between snap points. */
  breakPoints?: (string | number | typeof DefaultBreakpoint)[]
  /** The point to snap to when the drawer opens. */
  defaultSnapPoint?: string | number
  /** The active snap point. */
  activeSnapPoint: string | number
  /** Set the current active snap point. */
  setActiveSnapPoint(snapPoint: string | number): void
  /** The side of the viewport the drawer appears. Is used to properly calculate dragging. */
  side: 'top' | 'right' | 'bottom' | 'left'
  /** After how many milliseconds the cached distance used for the velocity function should reset. */
  velocityCacheReset: number
  /** Whether the user can skip snap points if the velocity is high enough. */
  allowSkippingSnapPoints: boolean
  /** Whether the logic to handle dragging on scrollable elements is enabled. */
  handleScrollableElements: boolean
  /** Whether the drawer is currently being dragged by the user. */
  isDragging: boolean
  /** Whether the drawer is currently transitioning to a snap point after the user stopped dragging or the drawer opens/closes. */
  isTransitioning: boolean
  /** How much the drawer is currently open. Can be > 1 depending on your `dampFunction`. */
  openPercentage: number
  /** The current translate value applied to the drawer. Is the same for every side. */
  translate: number
}

/** Context wrapper for the drawer. Is required for every drawer you create. */
const DrawerRoot: Component<DrawerRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
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
    defaultValue: localProps.initialOpen,
    onChange: localProps.onOpenChange,
  })

  const [activeSnapPoint, setActiveSnapPoint] = createControllableSignal({
    value: () => localProps.activeSnapPoint,
    defaultValue: 0,
    onChange: localProps.onActiveSnapPointChange,
  })

  const [dialogContext, setDialogContext] =
    createSignal<InternalDialogContextValue>()

  const [isDragging, setIsDragging] = createSignal(false)
  const [isTransitioning, setIsTransitioning] = createSignal(false)
  const drawerStyles = createMemo(() => {
    const contentRef = dialogContext()?.contentRef()
    if (!contentRef) return undefined
    return getComputedStyle(contentRef)
  })

  // TODO: This is a workaround because memos are synchronous in Solid v1.
  //       The height is still 0 when running in a memo because
  //       the children of the drawer element haven't been attached to
  //       the DOM yet.
  //       Maybe this can be rewritten to use a memo in v2.
  const [drawerSize, setDrawerSize] = createSignal(0)
  createEffect(() => {
    switch (localProps.side) {
      case 'top':
      case 'bottom':
        setDrawerSize(dialogContext()?.contentRef()?.clientHeight ?? 0)
        break
      case 'left':
      case 'right':
        setDrawerSize(dialogContext()?.contentRef()?.clientWidth ?? 0)
        break
    }
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

  const onOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true)
      batch(() => {
        setIsTransitioning(true)
        setActiveSnapPoint(localProps.defaultSnapPoint)
      })
      setTimeout(
        () => {
          setIsTransitioning(false)
        },
        parseFloat(drawerStyles()!.transitionDuration) * 1000,
      )
    } else {
      batch(() => {
        setIsTransitioning(true)
        setActiveSnapPoint(0)
      })
      setTimeout(
        () => {
          batch(() => {
            setOpen(false)
            setIsTransitioning(false)
          })
        },
        parseFloat(drawerStyles()!.transitionDuration) * 1000,
      )
    }
  }

  const childrenProps: DrawerRootChildrenProps = {
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
      return isTransitioning()
    },
    get openPercentage() {
      return openPercentage()
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
    get translate() {
      return translate()
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
          isTransitioning,
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
            isTransitioning,
            openPercentage,
            translate,
            velocityCacheReset: () => localProps.velocityCacheReset,
            allowSkippingSnapPoints: () => localProps.allowSkippingSnapPoints,
            handleScrollableElements: () => localProps.handleScrollableElements,
            dampFunction: localProps.dampFunction,
            velocityFunction: localProps.velocityFunction,
            setIsDragging,
            setIsTransitioning,
            setTranslate,
            drawerSize,
            resolvedActiveSnapPoint,
            drawerStyles,
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
