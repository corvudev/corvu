import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'
import type {
  FloatingOptions,
  FloatingState,
} from '@corvu/utils/create/floating'
import type { Placement, Strategy } from '@floating-ui/dom'

export type TooltipContextValue = {
  /** Whether the tooltip is open. */
  open: Accessor<boolean>
  /** Change the open state of the tooltip. */
  setOpen: Setter<boolean>
  /** The initial placement of the tooltip. */
  placement: Accessor<Placement>
  /** The strategy to use when positioning the tooltip. */
  strategy: Accessor<Strategy>
  /** Floating options of the tooltip. */
  floatingOptions: Accessor<FloatingOptions | null>
  /** The current floating state of the tooltip. */
  floatingState: Accessor<FloatingState>
  /** The delay in milliseconds before the tooltip opens after the mouse pointer is moved over the trigger. */
  openDelay: Accessor<number>
  /** The delay in milliseconds before the tooltip closes after the mouse pointer leaves. */
  closeDelay: Accessor<number>
  /** The duration in milliseconds that the tooltip should ignore the `openDelay` when the mouse pointer leaves and re-enters. */
  skipDelayDuration: Accessor<number>
  /** Whether the tooltip content should be hoverable. */
  hoverableContent: Accessor<boolean>
  /** The group this tooltip is in. */
  group: Accessor<true | string | null>
  /** Whether the tooltip should open when the trigger is focused. */
  openOnFocus: Accessor<boolean>
  /** Whether the tooltip should open when the mouse pointer is moved over the trigger. */
  openOnHover: Accessor<boolean>
  /** Whether the tooltip should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: Accessor<boolean>
  /** Whether the tooltip should close when the user presses on the trigger. */
  closeOnPointerDown: Accessor<boolean>
  /** Whether the tooltip content is present in the DOM. */
  contentPresent: Accessor<boolean>
  /** The tooltip content element. */
  contentRef: Accessor<HTMLElement | null>
  /** The `id` of the tooltip element. */
  tooltipId: Accessor<string>
}

const TooltipContext = createContext<TooltipContextValue>()

export const createTooltipContext = (contextId?: string) => {
  if (contextId === undefined) return TooltipContext

  const context = createKeyedContext<TooltipContextValue>(
    `tooltip-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the tooltip. Optionally provide a contextId to access a keyed context. */
export const useTooltipContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(TooltipContext)
    if (!context) {
      throw new Error(
        '[corvu]: Tooltip context not found. Make sure to wrap Tooltip components in <Tooltip.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<TooltipContextValue>(`tooltip-${contextId}`)
  if (!context) {
    throw new Error(
      `[corvu]: Tooltip context with id "${contextId}" not found. Make sure to wrap Tooltip components in <Tooltip.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalTooltipContextValue = TooltipContextValue & {
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  setAnchorRef: (element: HTMLElement) => void
  setTriggerRef: (element: HTMLElement) => void
  setContentRef: (element: HTMLElement) => void
  setArrowRef: (element: HTMLElement) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
  onPointerDown?: (event: PointerEvent) => void
}

const InternalTooltipContext = createContext<InternalTooltipContextValue>()

export const createInternalTooltipContext = (contextId?: string) => {
  if (contextId === undefined) return InternalTooltipContext

  const context = createKeyedContext<InternalTooltipContextValue>(
    `tooltip-internal-${contextId}`,
  )
  return context
}

export const useInternalTooltipContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalTooltipContext)
    if (!context) {
      throw new Error(
        '[corvu]: Tooltip context not found. Make sure to wrap Tooltip components in <Tooltip.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalTooltipContextValue>(
    `tooltip-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Tooltip context with id "${contextId}" not found. Make sure to wrap Tooltip components in <Tooltip.Root contextId="${contextId}">`,
    )
  }
  return context
}
