import {
  type Component,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  splitProps,
  untrack,
} from 'solid-js'
import {
  createInternalPopoverContext,
  createPopoverContext,
} from '@src/context'
import Dialog, {
  type ContextValue as DialogContextValue,
  type RootChildrenProps as DialogRootChildrenProps,
  type RootProps as DialogRootProps,
} from '@corvu/dialog'
import type {
  FloatingOptions,
  FloatingState,
} from '@corvu/utils/create/floating'
import type { Placement, Strategy } from '@floating-ui/dom'
import createFloating from '@corvu/utils/create/floating'
import createOnce from '@corvu/utils/create/once'
import { isFunction } from '@corvu/utils'

export type PopoverRootProps = {
  /**
   * The initial placement of the popover.
   * @defaultValue `'bottom'`
   */
  placement?: Placement
  /**
   * The strategy to use when positioning the popover.
   * @defaultValue `'absolute'`
   */
  strategy?: Strategy
  /**
   * Floating options of the popover.
   * @defaultValue `{ flip: true, shift: true }`
   */
  floatingOptions?: FloatingOptions | null
  /** @hidden */
  children:
    | JSX.Element
    | ((
        props: PopoverRootChildrenProps & DialogRootChildrenProps,
      ) => JSX.Element)
} & Omit<DialogRootProps, 'children'>

/** Props that are passed to the Root component children callback. */
export type PopoverRootChildrenProps = {
  /** The initial placement of the popover. */
  placement: Placement
  /** The strategy to use when positioning the popover. */
  strategy: Strategy
  /** Floating options of the popover. */
  floatingOptions: FloatingOptions | null
  /** The current floating state of the popover. */
  floatingState: FloatingState
}

/** Context wrapper for the popover. Is required for every popover you create. */
const PopoverRoot: Component<PopoverRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      placement: 'bottom' as const,
      strategy: 'absolute' as const,
      floatingOptions: {
        flip: true,
        shift: true,
      },
      modal: false,
      closeOnOutsidePointer: true,
    },
    props,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'placement',
    'strategy',
    'floatingOptions',
    'contextId',
    'children',
  ])

  const [dialogContext, setDialogContext] = createSignal<DialogContextValue>()

  const [anchorRef, setAnchorRef] = createSignal<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | null>(null)
  const [arrowRef, setArrowRef] = createSignal<HTMLElement | null>(null)

  const floatingState = createFloating({
    enabled: () => dialogContext()?.contentPresent() ?? false,
    floating: () => dialogContext()?.contentRef() ?? null,
    reference: () => anchorRef() ?? triggerRef() ?? null,
    arrow: arrowRef,
    placement: () => localProps.placement,
    strategy: () => localProps.strategy,
    options: () => localProps.floatingOptions,
  })

  const childrenProps: PopoverRootChildrenProps = {
    get placement() {
      return localProps.placement
    },
    get strategy() {
      return localProps.strategy
    },
    get floatingOptions() {
      return localProps.floatingOptions
    },
    get floatingState() {
      return floatingState()
    },
  }

  const memoizedChildren = createOnce(() => localProps.children)

  const resolveChildren = (dialogChildrenProps: DialogRootChildrenProps) => {
    setDialogContext(Dialog.useContext(localProps.contextId))

    const children = memoizedChildren()()
    if (isFunction(children)) {
      const mergedProps = mergeProps(dialogChildrenProps, childrenProps)
      return children(mergedProps)
    }
    return children
  }

  const memoizedPopoverRoot = createMemo(() => {
    const PopoverContext = createPopoverContext(localProps.contextId)
    const InternalPopoverContext = createInternalPopoverContext(
      localProps.contextId,
    )

    return untrack(() => (
      <PopoverContext.Provider
        value={{
          placement: () => localProps.placement,
          strategy: () => localProps.strategy,
          floatingOptions: () => localProps.floatingOptions,
          floatingState,
        }}
      >
        <InternalPopoverContext.Provider
          value={{
            placement: () => localProps.placement,
            strategy: () => localProps.strategy,
            floatingOptions: () => localProps.floatingOptions,
            floatingState,
            setAnchorRef,
            setTriggerRef,
            setArrowRef,
          }}
        >
          <Dialog contextId={localProps.contextId} {...otherProps}>
            {(dialogChildrenProps) => resolveChildren(dialogChildrenProps)}
          </Dialog>
        </InternalPopoverContext.Provider>
      </PopoverContext.Provider>
    ))
  })

  return memoizedPopoverRoot as unknown as JSX.Element
}

export default PopoverRoot
