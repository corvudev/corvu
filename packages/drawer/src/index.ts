import {
  DrawerClose as Close,
  DrawerDescription as Description,
  DrawerLabel as Label,
  DrawerTrigger as Trigger,
} from '@src/DialogOverrides'
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
} from '@corvu/dialog'
import {
  type DrawerContextValue,
  useDrawerContext as useContext,
} from '@src/context'
import Root, {
  type DrawerRootChildrenProps,
  type DrawerRootProps,
} from '@src/Root'
import type { Side, Size } from '@corvu/utils'
import Content from '@src/Content'
import Overlay from '@src/Overlay'

export type {
  DrawerRootProps as RootProps,
  DrawerRootChildrenProps as RootChildrenProps,
  TriggerProps,
  PortalProps,
  OverlayProps,
  ContentProps,
  LabelProps,
  DescriptionProps,
  CloseProps,
  DrawerContextValue as ContextValue,
  DialogContextValue,
  Side,
  Size,
}

export {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
  useContext,
  useDialogContext,
}

const Drawer = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
  useContext,
  useDialogContext,
})

export default Drawer
