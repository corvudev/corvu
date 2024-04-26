import { type Accessor, createContext, useContext } from 'solid-js'
import { createKeyedContext, useKeyedContext } from '@lib/create/keyedContext'
import type { ResizeStrategy } from '@primitives/resizable/lib/types'
import type { Size } from '@lib/types'

export type ResizablePanelContextValue = {
  /** The current size of the panel. */
  size: Accessor<number>
  /** The minimum size of the panel. */
  minSize: Accessor<Size | null>
  /** The maximum size of the panel. */
  maxSize: Accessor<Size | null>
  /** Whether the panel is collapsible. */
  collapsible: Accessor<boolean>
  /** The size the panel should collapse to. */
  collapsedSize: Accessor<Size>
  /** How much the user has to "overdrag" for the panel to collapse. */
  collapseThreshold: Accessor<Size>
  /** Whether the panel is currently collapsed. */
  collapsed: Accessor<boolean>
  /** Resize the panel to a specific size with the given strategy. */
  resize: (size: Size, strategy?: ResizeStrategy) => void
  /** Collapse the panel with the given strategy. Only works if `collapsible` is set to `true`. */
  collapse: (strategy?: ResizeStrategy) => void
  /** Expand the panel with the given strategy. Only works if `collapsible` is set to `true`. */
  expand: (strategy?: ResizeStrategy) => void
  /** The `id` attribute of the resizable panel element. */
  panelId: Accessor<string>
}

const ResizablePanelContext = createContext<ResizablePanelContextValue>()

export const createResizablePanelContext = (contextId?: string) => {
  if (contextId === undefined) return ResizablePanelContext

  const context = createKeyedContext<ResizablePanelContextValue>(
    `resizable-panel-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with a resizable panel. Optionally provide a contextId to access a keyed context. */
export const useResizablePanelContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(ResizablePanelContext)
    if (!context) {
      throw new Error(
        '[corvu]: Resizable panel context not found. Make sure to call usePanelContext under <Resizable.Panel>',
      )
    }
    return context
  }

  const context = useKeyedContext<ResizablePanelContextValue>(
    `resizable-panel-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Resizable context with id "${contextId}" not found. Make sure to call usePanelContext under <Resizable.Panel contextId="${contextId}">`,
    )
  }
  return context
}
