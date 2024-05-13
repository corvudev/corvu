import {
  type ResizableContextValue as ContextValue,
  useResizableContext as useContext,
} from '@src/context'
import Handle, {
  type ResizableHandleCorvuProps as HandleCorvuProps,
  type ResizableHandleElementProps as HandleElementProps,
  type ResizableHandleProps as HandleProps,
  type ResizableHandleSharedElementProps as HandleSharedElementProps,
} from '@src/Handle'
import Panel, {
  type ResizablePanelChildrenProps as PanelChildrenProps,
  type ResizablePanelCorvuProps as PanelCorvuProps,
  type ResizablePanelElementProps as PanelElementProps,
  type ResizablePanelProps as PanelProps,
  type ResizablePanelSharedElementProps as PanelSharedElementProps,
} from '@src/Panel'
import {
  type ResizablePanelContextValue as PanelContextValue,
  useResizablePanelContext as usePanelContext,
} from '@src/panelContext'
import Root, {
  type ResizableRootChildrenProps as RootChildrenProps,
  type ResizableRootCorvuProps as RootCorvuProps,
  type ResizableRootElementProps as RootElementProps,
  type ResizableRootProps as RootProps,
  type ResizableRootSharedElementProps as RootSharedElementProps,
} from '@src/Root'
import type { DynamicProps } from '@corvu/utils/dynamic'
import type { ResizeStrategy } from '@src/lib/types'
import type { Size } from '@corvu/utils'

export type {
  RootCorvuProps,
  RootSharedElementProps,
  RootElementProps,
  RootProps,
  RootChildrenProps,
  PanelCorvuProps,
  PanelSharedElementProps,
  PanelElementProps,
  PanelProps,
  PanelChildrenProps,
  HandleCorvuProps,
  HandleSharedElementProps,
  HandleElementProps,
  HandleProps,
  ContextValue,
  PanelContextValue,
  ResizeStrategy,
  Size,
  DynamicProps,
}

export { Root, Panel, Handle, useContext, usePanelContext }

const Resizable = Object.assign(Root, {
  Panel,
  Handle,
  useContext,
  usePanelContext,
})

export default Resizable
