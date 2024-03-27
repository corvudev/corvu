import Panel, { type ResizablePanelProps } from '@primitives/resizable/Panel'
import {
  type ResizableContextValue,
  useResizableContext as useContext,
} from '@primitives/resizable/context'
import ResizeHandle, {
  type ResizableHandleProps,
} from '@primitives/resizable/ResizeHandle'
import Root, {
  type ResizableRootChildrenProps,
  type ResizableRootProps,
} from '@primitives/resizable/Root'

export type {
  ResizableContextValue as ContextValue,
  ResizableRootProps as RootProps,
  ResizableRootChildrenProps as RootChildrenProps,
  ResizablePanelProps as PanelProps,
  ResizableHandleProps as ResizeHandleProps,
}

export { useContext, Root, Panel, ResizeHandle }

export default {
  useContext,
  Root,
  Panel,
  ResizeHandle,
}
