import {
  DrawerClose as Close,
  DrawerDescription as Description,
  DrawerLabel as Label,
  DrawerTrigger as Trigger,
} from '@primitives/drawer/DialogOverrides'
import {
  type CloseProps,
  type ContentProps,
  type DescriptionProps,
  type ContextValue as DialogContextValue,
  type LabelProps,
  type OverlayProps,
  Portal,
  type PortalProps,
  type TriggerProps,
  useContext as useDialogContext,
} from '@primitives/dialog'
import {
  type DrawerContextValue,
  useDrawerContext as useContext,
} from '@primitives/drawer/context'
import Root, {
  type DrawerRootChildrenProps,
  type DrawerRootProps,
} from '@primitives/drawer/Root'
import Content from '@primitives/drawer/Content'
import Overlay from '@primitives/drawer/Overlay'

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

export const Drawer = Object.assign(Root, {
  useContext,
  useDialogContext,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
})
