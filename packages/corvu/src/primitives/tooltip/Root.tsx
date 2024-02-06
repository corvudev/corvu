import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  type Setter,
  untrack,
} from 'solid-js'
import {
  createInternalTooltipContext,
  createTooltipContext,
} from '@primitives/tooltip/context'
import type { FloatingOptions, FloatingState } from '@lib/create/floating'
import type { Placement, Strategy } from '@floating-ui/dom'
import { callEventHandler } from '@lib/utils'
import createControllableSignal from '@lib/create/controllableSignal'
import createFloating from '@lib/create/floating'
import createOnce from '@lib/create/once'
import createPresence from '@lib/create/presence'
import createTooltip from '@lib/create/tooltip'
import type { EventHandlerEvent } from '@lib/types'
import { isFunction } from '@lib/assertions'

export type TooltipRootProps = {
  /**
   * Whether the tooltip is open.
   */
  open?: boolean
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether the tooltip is open initially.
   * @defaultValue `false`
   */
  initialOpen?: boolean
  /**
   * The initial placement of the tooltip.
   * @defaultValue `'bottom'`
   */
  placement?: Placement
  /**
   * The strategy to use when positioning the tooltip.
   * @defaultValue `'absolute'`
   */
  strategy?: Strategy
  /**
   * Floating options of the tooltip.
   * @defaultValue `{ flip: true, shift: true }`
   */
  floatingOptions?: FloatingOptions | null
  /**
   * The delay in milliseconds before the tooltip opens after the mouse pointer is moved over the trigger.
   * @defaultValue `500`
   */
  openDelay?: number
  /**
   * The delay in milliseconds before the tooltip closes after the mouse pointer leaves.
   * @defaultValue `0`
   */
  closeDelay?: number
  /**
   * The duration in milliseconds that the tooltip should ignore the `openDelay` when the mouse pointer leaves and re-enters.
   * @defaultValue `0`
   */
  skipDelayDuration?: number
  /**
   * Whether the tooltip content should be hoverable.
   * @defaultValue `true`
   */
  hoverableContent?: boolean
  /**
   * Optionally add this tooltip to a group. With the same `group` property will close when another tooltip in the same group opens.
   */
  group?: boolean | string
  /**
   * Whether the tooltip should open when the trigger is focused.
   * @defaultValue `true`
   */
  openOnFocus?: boolean
  /**
   * Callback fired when the trigger is focused and `openOnFocus` is `true`. Can be prevented by calling `event.preventDefault`.
   */
  onFocus?: (event: FocusEvent) => void
  /**
   * Callback fired when the trigger is blurred and `openOnFocus` is `true`. Can be prevented by calling `event.preventDefault`.
   */
  onBlur?: (event: FocusEvent) => void
  /**
   * Whether the tooltip should open when the mouse pointer is moved over the trigger.
   * @defaultValue `true`
   */
  openOnHover?: boolean
  /**
   * Callback fired when the mouse pointer is moved over the trigger and `openOnHover` is `true`. Can be prevented by calling `event.preventDefault`.
   */
  onHover?: (event: MouseEvent) => void
  /**
   * Callback fired when the mouse pointer leaves the tooltip and `openOnHover` is `true`. Can be prevented by calling `event.preventDefault`.
   */
  onLeave?: (event: MouseEvent) => void
  /**
   * Whether the tooltip should close when the user presses the `Escape` key.
   * @defaultValue `true`
   */
  closeOnEscapeKeyDown?: boolean
  /**
   * Callback fired when the user presses the `Escape` key. Can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /**
   * Whether the tooltip should close when the user presses on the trigger.
   * @defaultValue `true`
   */
  closeOnPointerDown?: boolean
  /**
   * Callback fired when the user presses on the trigger and `closeOnPointerDown` is `true`. Can be prevented by calling `event.preventDefault`.
   */
  onPointerDown?: (event: MouseEvent) => void
  /**
   * The `id` attribute of the tooltip element.
   * @defaultValue A unique id
   */
  tooltipId?: string
  /**
   * The `id` attribute of the tooltip trigger element.
   * @defaultValue A unique id
   */
  triggerId?: string
  /**
   * The `id` of the tooltip context. Useful if you have nested tooltips and want to create components that belong to a tooltip higher up in the tree.
   */
  contextId?: string
  children: JSX.Element | ((props: TooltipRootChildrenProps) => JSX.Element)
}

/** Props that are passed to the Root component children callback. */
export type TooltipRootChildrenProps = {
  /** Whether the tooltip is open. */
  open: boolean
  /** Change the open state of the tooltip. */
  setOpen: Setter<boolean>
  /** The initial placement of the tooltip. */
  placement: Placement
  /** The strategy to use when positioning the tooltip. */
  strategy: Strategy
  /** Floating options of the tooltip. */
  floatingOptions: FloatingOptions | null
  /** The current floating state of the tooltip. */
  floatingState: FloatingState
  /** The delay in milliseconds before the tooltip opens after the mouse pointer is moved over the trigger. */
  openDelay: number
  /** The delay in milliseconds before the tooltip closes after the mouse pointer leaves. */
  closeDelay: number
  /** The duration in milliseconds that the tooltip should ignore the `openDelay` when the mouse pointer leaves and re-enters. */
  skipDelayDuration: number
  /** Whether the tooltip content should be hoverable. */
  hoverableContent: boolean
  /** The group this tooltip is in. */
  group: boolean | string | null
  /** Whether the tooltip should open when the trigger is focused. */
  openOnFocus: boolean
  /** Whether the tooltip should open when the mouse pointer is moved over the trigger. */
  openOnHover: boolean
  /** Whether the tooltip should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: boolean
  /** Whether the tooltip should close when the user presses on the trigger. */
  closeOnPointerDown: boolean
  /** Whether the tooltip content is present in the DOM. */
  contentPresent: boolean
  /** The tooltip content element. */
  contentRef: HTMLElement | null
  /** The `id` of the tooltip element. */
  tooltipId: string
  /** The `id` of the tooltip trigger element. */
  triggerId: string
}

const tooltipGroups = new Map<
  boolean | string,
  {
    id: string
    close: () => void
  }[]
>()
const registerTooltip = (
  group: boolean | string,
  id: string,
  close: () => void,
) => {
  if (!tooltipGroups.has(group)) {
    tooltipGroups.set(group, [])
  }
  tooltipGroups.get(group)!.push({ id, close })
}
const unregisterTooltip = (group: boolean | string, id: string) => {
  const tooltips = tooltipGroups.get(group)
  if (!tooltips) return
  const index = tooltips.findIndex((tooltip) => tooltip.id === id)
  if (index !== -1) {
    tooltips.splice(index, 1)
  }
}
const closeTooltipGroup = (group: boolean | string, id: string) => {
  const tooltips = tooltipGroups.get(group)
  if (!tooltips) return
  tooltips.forEach((tooltip) => {
    if (tooltip.id !== id) {
      tooltip.close()
    }
  })
}

/** Context wrapper for the tooltip. Is required for every tooltip you create. */
const TooltipRoot: Component<TooltipRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      initialOpen: false,
      placement: 'bottom' as const,
      strategy: 'absolute' as const,
      floatingOptions: {
        flip: true,
        shift: true,
      },
      openDelay: 500,
      closeDelay: 0,
      skipDelayDuration: 0,
      hoverableContent: true,
      group: null,
      openOnFocus: true,
      openOnHover: true,
      closeOnEscapeKeyDown: true,
      closeOnPointerDown: true,
      tooltipId: createUniqueId(),
      triggerId: createUniqueId(),
    },
    props,
  )

  const [open, setOpen] = createControllableSignal({
    value: () => defaultedProps.open,
    initialValue: defaultedProps.initialOpen,
    onChange: defaultedProps.onOpenChange,
  })

  createEffect(() => {
    const group = defaultedProps.group
    const id = defaultedProps.tooltipId
    if (!group) return
    registerTooltip(group, id, () => setOpen(false))
    onCleanup(() => {
      unregisterTooltip(group, id)
    })
  })

  createEffect(() => {
    if (!open()) return
    untrack(() => {
      const group = defaultedProps.group
      if (!group) return
      closeTooltipGroup(group, defaultedProps.tooltipId)
    })
  })

  const [anchorRef, setAnchorRef] = createSignal<HTMLElement | null>(null)
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | null>(null)
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)
  const [arrowRef, setArrowRef] = createSignal<HTMLElement | null>(null)

  const { present: contentPresent } = createPresence({
    show: open,
    element: contentRef,
  })

  const floatingState = createFloating({
    enabled: contentPresent,
    floating: contentRef,
    reference: () => anchorRef() ?? triggerRef() ?? null,
    arrow: arrowRef,
    placement: () => defaultedProps.placement,
    strategy: () => defaultedProps.strategy,
    options: () => defaultedProps.floatingOptions,
  })

  createTooltip({
    trigger: triggerRef,
    content: contentRef,
    openOnFocus: () => defaultedProps.openOnFocus,
    openOnHover: () => defaultedProps.openOnHover,
    closeOnPointerDown: () => defaultedProps.closeOnPointerDown,
    hoverableContent: () => defaultedProps.hoverableContent,
    openDelay: () => defaultedProps.openDelay,
    closeDelay: () => defaultedProps.closeDelay,
    skipDelayDuration: () => defaultedProps.skipDelayDuration,
    onHover: (event: PointerEvent) => {
      if (
        callEventHandler(
          defaultedProps.onHover,
          event as EventHandlerEvent<HTMLElement, PointerEvent>,
        )
      )
        return
      setOpen(true)
    },
    onLeave: (event: PointerEvent) => {
      if (
        callEventHandler(
          defaultedProps.onLeave,
          event as EventHandlerEvent<HTMLElement, PointerEvent>,
        )
      )
        return
      setOpen(false)
    },
    onFocus: (event: FocusEvent) => {
      if (
        callEventHandler(
          defaultedProps.onFocus,
          event as EventHandlerEvent<HTMLElement, FocusEvent>,
        )
      )
        return
      setOpen(true)
    },
    onBlur: (event: FocusEvent) => {
      if (
        callEventHandler(
          defaultedProps.onBlur,
          event as EventHandlerEvent<HTMLElement, FocusEvent>,
        )
      )
        return
      setOpen(false)
    },
    onPointerDown: (event: MouseEvent) => {
      if (
        callEventHandler(
          defaultedProps.onPointerDown,
          event as EventHandlerEvent<HTMLElement, MouseEvent>,
        )
      )
        return
      setOpen(false)
    },
  })

  const childrenProps: TooltipRootChildrenProps = {
    get open() {
      return open()
    },
    setOpen,
    get placement() {
      return defaultedProps.placement
    },
    get strategy() {
      return defaultedProps.strategy
    },
    get floatingOptions() {
      return defaultedProps.floatingOptions
    },
    get floatingState() {
      return floatingState()
    },
    get openDelay() {
      return defaultedProps.openDelay
    },
    get closeDelay() {
      return defaultedProps.closeDelay
    },
    get skipDelayDuration() {
      return defaultedProps.skipDelayDuration
    },
    get hoverableContent() {
      return defaultedProps.hoverableContent
    },
    get group() {
      return defaultedProps.group
    },
    get openOnFocus() {
      return defaultedProps.openOnFocus
    },
    get openOnHover() {
      return defaultedProps.openOnHover
    },
    get closeOnEscapeKeyDown() {
      return defaultedProps.closeOnEscapeKeyDown
    },
    get closeOnPointerDown() {
      return defaultedProps.closeOnPointerDown
    },
    get contentPresent() {
      return contentPresent()
    },
    get contentRef() {
      return contentRef()
    },
    get tooltipId() {
      return defaultedProps.tooltipId
    },
    get triggerId() {
      return defaultedProps.triggerId
    },
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  const memoizedTooltipRoot = createMemo(() => {
    const TooltipContext = createTooltipContext(defaultedProps.contextId)
    const InternalTooltipContext = createInternalTooltipContext(
      defaultedProps.contextId,
    )

    return untrack(() => (
      <TooltipContext.Provider
        value={{
          open,
          setOpen,
          placement: () => defaultedProps.placement,
          strategy: () => defaultedProps.strategy,
          floatingOptions: () => defaultedProps.floatingOptions,
          floatingState,
          openDelay: () => defaultedProps.openDelay,
          closeDelay: () => defaultedProps.closeDelay,
          skipDelayDuration: () => defaultedProps.skipDelayDuration,
          hoverableContent: () => defaultedProps.hoverableContent,
          group: () => defaultedProps.group,
          openOnFocus: () => defaultedProps.openOnFocus,
          openOnHover: () => defaultedProps.openOnHover,
          closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
          closeOnPointerDown: () => defaultedProps.closeOnPointerDown,
          contentPresent,
          contentRef,
          tooltipId: () => defaultedProps.tooltipId,
          triggerId: () => defaultedProps.triggerId,
        }}
      >
        <InternalTooltipContext.Provider
          value={{
            open,
            setOpen,
            placement: () => defaultedProps.placement,
            strategy: () => defaultedProps.strategy,
            floatingOptions: () => defaultedProps.floatingOptions,
            floatingState,
            openDelay: () => defaultedProps.openDelay,
            closeDelay: () => defaultedProps.closeDelay,
            skipDelayDuration: () => defaultedProps.skipDelayDuration,
            hoverableContent: () => defaultedProps.hoverableContent,
            group: () => defaultedProps.group,
            openOnFocus: () => defaultedProps.openOnFocus,
            openOnHover: () => defaultedProps.openOnHover,
            closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
            closeOnPointerDown: () => defaultedProps.closeOnPointerDown,
            contentPresent,
            contentRef,
            tooltipId: () => defaultedProps.tooltipId,
            triggerId: () => defaultedProps.triggerId,
            onFocus: defaultedProps.onFocus,
            onBlur: defaultedProps.onBlur,
            onPointerDown: defaultedProps.onPointerDown,
            onEscapeKeyDown: defaultedProps.onEscapeKeyDown,
            setAnchorRef,
            setTriggerRef,
            setContentRef,
            setArrowRef,
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalTooltipContext.Provider>
      </TooltipContext.Provider>
    ))
  })

  return memoizedTooltipRoot as unknown as JSX.Element
}

export default TooltipRoot
