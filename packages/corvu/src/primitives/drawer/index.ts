import {
  Close,
  type CloseProps,
  type ContentProps,
  Description,
  type DescriptionProps,
  type ContextValue as DialogContextValue,
  Label,
  type LabelProps,
  Overlay,
  type OverlayProps,
  Portal,
  type PortalProps,
  Trigger,
  type TriggerProps,
  useContext as useDialogContext,
} from '@primitives/dialog'
import {
  type DrawerContextValue,
  useDrawerContext as useContext,
} from '@primitives/drawer/context'
import Root, {
  DefaultBreakpoint,
  type DrawerRootChildrenProps,
  type DrawerRootProps,
} from '@primitives/drawer/Root'
import Content from '@primitives/drawer/Content'

export type {
  DrawerContextValue as ContextValue,
  DialogContextValue,
  DrawerRootProps as RootProps,
  DrawerRootChildrenProps as RootChildrenProps,
  TriggerProps,
  PortalProps,
  OverlayProps,
  ContentProps,
  LabelProps,
  DescriptionProps,
  CloseProps,
}

export {
  DefaultBreakpoint,
  useContext,
  useDialogContext,
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
}

export default {
  DefaultBreakpoint,
  useContext,
  useDialogContext,
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
}
