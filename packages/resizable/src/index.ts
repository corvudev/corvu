import Handle, { type ResizableHandleProps } from '@src/Handle'
import Panel, {
  type ResizablePanelChildrenProps,
  type ResizablePanelProps,
} from '@src/Panel'
import {
  type ResizableContextValue,
  useResizableContext as useContext,
} from '@src/context'
import {
  type ResizablePanelContextValue,
  useResizablePanelContext as usePanelContext,
} from '@src/panelContext'
import Root, {
  type ResizableRootChildrenProps,
  type ResizableRootProps,
} from '@src/Root'
import type { ResizeStrategy } from '@src/lib/types'
import type { Size } from '@corvu/utils'

export type {
  ResizableRootProps as RootProps,
  ResizableRootChildrenProps as RootChildrenProps,
  ResizablePanelProps as PanelProps,
  ResizablePanelChildrenProps as PanelChildrenProps,
  ResizableHandleProps as HandleProps,
  ResizableContextValue as ContextValue,
  ResizablePanelContextValue as PanelContextValue,
  ResizeStrategy,
  Size,
}

export { Root, Panel, Handle, useContext, usePanelContext }

const Resizable = Object.assign(Root, {
  Panel,
  Handle,
  useContext,
  usePanelContext,
})

export default Resizable
