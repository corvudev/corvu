import { type Accessor, createContext, useContext } from 'solid-js'
import { createKeyedContext, useKeyedContext } from '@lib/create/keyedContext'
import type { PanelData, PanelInstance } from '@primitives/resizable/Panel'

export type ResizableContextValue = {
  orientation: Accessor<'horizontal' | 'vertical'>
}

const ResizableContext = createContext<ResizableContextValue>()

export const createResizableContext = (contextId?: string) => {
  if (!contextId) return ResizableContext

  const context = createKeyedContext<ResizableContextValue>(
    `resizable-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the resizable. Optionally provide a contextId to access a keyed context. */
export const useResizableContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(ResizableContext)
    if (!context) {
      throw new Error(
        '[corvu]: Resizable context not found. Make sure to wrap Resizable components in <Resizable.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<ResizableContextValue>(
    `resizable-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Resizable context with id "${contextId}" not found. Make sure to wrap Resizable components in <Resizable.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalResizableContextValue = ResizableContextValue & {
  registerPanel: (panelData: PanelData) => PanelInstance
  unregisterPanel: (id: string) => void
  onDrag: (handle: HTMLElement, start: number, delta: number) => void
  onDragEnd: () => void
  onKeyDown: (handle: HTMLElement, event: KeyboardEvent) => void
}

const InternalResizableContext = createContext<InternalResizableContextValue>()

export const createInternalResizableContext = (contextId?: string) => {
  if (!contextId) return InternalResizableContext

  const context = createKeyedContext<InternalResizableContextValue>(
    `resizable-internal-${contextId}`,
  )
  return context
}

export const useInternalResizableContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(InternalResizableContext)
    if (!context) {
      throw new Error(
        '[corvu]: Resizable context not found. Make sure to wrap Resizable components in <Resizable.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalResizableContextValue>(
    `resizable-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Resizable context with id "${contextId}" not found. Make sure to wrap Resizable components in <Resizable.Root contextId="${contextId}">`,
    )
  }
  return context
}
