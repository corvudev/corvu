import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import { createKeyedContext, useKeyedContext } from '@lib/create/keyedContext'
import type { FloatingOptions, FloatingState } from '@lib/create/floating'
import type { Placement, Strategy } from '@floating-ui/dom'

export type PopoverContextValue = {
  /** The initial placement of the popover. */
  placement: Accessor<Placement>
  /** The strategy to use when positioning the popover. */
  strategy: Accessor<Strategy>
  /** Floating options of the popover. */
  floatingOptions: Accessor<FloatingOptions | null>
  /** The current floating state of the popover. */
  floatingState: Accessor<FloatingState>
}

const PopoverContext = createContext<PopoverContextValue>()

export const createPopoverContext = (contextId?: string) => {
  if (!contextId) return PopoverContext

  const context = createKeyedContext<PopoverContextValue>(
    `popover-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the popover. Optionally provide a contextId to access a keyed context. */
export const usePopoverContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(PopoverContext)
    if (!context) {
      throw new Error(
        '[corvu]: Popover context not found. Make sure to wrap Popover components in <Popover.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<PopoverContextValue>(`popover-${contextId}`)
  if (!context) {
    throw new Error(
      `[corvu]: Popover context with id "${contextId}" not found. Make sure to wrap Popover components in <Popover.Root contextId="${contextId}">`,
    )
  }
  return context
}

type InternalPopoverContextValue = PopoverContextValue & {
  setAnchorRef: Setter<HTMLElement | null>
  setArrowRef: Setter<HTMLElement | null>
}

const InternalPopoverContext = createContext<InternalPopoverContextValue>()

export const createInternalPopoverContext = (contextId?: string) => {
  if (!contextId) return InternalPopoverContext

  const context = createKeyedContext<InternalPopoverContextValue>(
    `popover-internal-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the popover. Optionally provide a contextId to access a keyed context. */
export const useInternalPopoverContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(InternalPopoverContext)
    if (!context) {
      throw new Error(
        '[corvu]: Popover context not found. Make sure to wrap Popover components in <Popover.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalPopoverContextValue>(
    `popover-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Popover context with id "${contextId}" not found. Make sure to wrap Popover components in <Popover.Root contextId="${contextId}">`,
    )
  }
  return context
}
