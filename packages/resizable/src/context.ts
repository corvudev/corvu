import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'
import type { PanelData, PanelInstance, ResizeStrategy } from '@src/lib/types'
import type { Size } from '@corvu/utils'

export type ResizableContextValue = {
  /** The orientation of the resizable. */
  orientation: Accessor<'horizontal' | 'vertical'>
  /** The sizes of the panels. */
  sizes: Accessor<number[]>
  /** Change the sizes of the panels. */
  setSizes: Setter<number[]>
  /** The delta to use when resizing with arrow keys. */
  keyboardDelta: Accessor<Size>
  /** Whether to handle the cursor style when resizing. */
  handleCursorStyle: Accessor<boolean>
  /** Resize a panel to a specific size with the given strategy. */
  resize: (panelIndex: number, size: Size, strategy?: ResizeStrategy) => void
  /** Collapse a panel with the given strategy. Only works if `collapsible` is set to `true`. */
  collapse: (panelIndex: number, strategy?: ResizeStrategy) => void
  /** Expand a panel with the given strategy. Only works if `collapsible` is set to `true`. */
  expand: (panelIndex: number, strategy?: ResizeStrategy) => void
}

const ResizableContext = createContext<ResizableContextValue>()

export const createResizableContext = (contextId?: string) => {
  if (contextId === undefined) return ResizableContext

  const context = createKeyedContext<ResizableContextValue>(
    `resizable-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the resizable. Optionally provide a contextId to access a keyed context. */
export const useResizableContext = (contextId?: string) => {
  if (contextId === undefined) {
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
  rootSize: Accessor<number>
  panels: Accessor<PanelInstance[]>
  registerPanel: (panelData: PanelData) => PanelInstance
  unregisterPanel: (id: string) => void
  onDrag: (handle: HTMLElement, delta: number, altKey: boolean) => void
  onDragEnd: () => void
  onKeyDown: (
    handle: HTMLElement,
    event: KeyboardEvent,
    altKey: boolean,
  ) => void
}

const InternalResizableContext = createContext<InternalResizableContextValue>()

export const createInternalResizableContext = (contextId?: string) => {
  if (contextId === undefined) return InternalResizableContext

  const context = createKeyedContext<InternalResizableContextValue>(
    `resizable-internal-${contextId}`,
  )
  return context
}

export const useInternalResizableContext = (contextId?: string) => {
  if (contextId === undefined) {
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
