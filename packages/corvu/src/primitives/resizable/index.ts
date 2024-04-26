import Handle, { type ResizableHandleProps } from '@primitives/resizable/Handle'
import Panel, {
  type ResizablePanelChildrenProps,
  type ResizablePanelProps,
} from '@primitives/resizable/Panel'
import {
  type ResizableContextValue,
  useResizableContext as useContext,
} from '@primitives/resizable/context'
import {
  type ResizablePanelContextValue,
  useResizablePanelContext as usePanelContext,
} from '@primitives/resizable/panelContext'
import Root, {
  type ResizableRootChildrenProps,
  type ResizableRootProps,
} from '@primitives/resizable/Root'
import type { ResizeStrategy } from '@primitives/resizable/lib/types'

export type {
  ResizableContextValue as ContextValue,
  ResizablePanelContextValue as PanelContextValue,
  ResizableRootProps as RootProps,
  ResizableRootChildrenProps as RootChildrenProps,
  ResizablePanelProps as PanelProps,
  ResizablePanelChildrenProps as PanelChildrenProps,
  ResizableHandleProps as HandleProps,
  ResizeStrategy,
}

export { useContext, usePanelContext, Root, Panel, Handle }

export const Resizable = Object.assign(Root, {
  useContext,
  usePanelContext,
  Panel,
  Handle,
})
