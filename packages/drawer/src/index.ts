import Close, {
  type DrawerCloseCorvuProps as CloseCorvuProps,
  type DrawerCloseElementProps as CloseElementProps,
  type DrawerCloseProps as CloseProps,
  type DrawerCloseSharedElementProps as CloseSharedElementProps,
} from '@src/Close'
import Content, {
  type DrawerContentCorvuProps as ContentCorvuProps,
  type DrawerContentElementProps as ContentElementProps,
  type DrawerContentProps as ContentProps,
  type DrawerContentSharedElementProps as ContentSharedElementProps,
} from '@src/Content'
import Description, {
  type DrawerDescriptionCorvuProps as DescriptionCorvuProps,
  type DrawerDescriptionElementProps as DescriptionElementProps,
  type DrawerDescriptionProps as DescriptionProps,
  type DrawerDescriptionSharedElementProps as DescriptionSharedElementProps,
} from '@src/Description'
import {
  type ContextValue as DialogContextValue,
  Portal,
  type PortalProps,
  useContext as useDialogContext,
} from '@corvu/dialog'
import {
  type DrawerContextValue,
  useDrawerContext as useContext,
} from '@src/context'
import Label, {
  type DrawerLabelCorvuProps as LabelCorvuProps,
  type DrawerLabelElementProps as LabelElementProps,
  type DrawerLabelProps as LabelProps,
  type DrawerLabelSharedElementProps as LabelSharedElementProps,
} from '@src/Label'
import Overlay, {
  type DrawerOverlayCorvuProps as OverlayCorvuProps,
  type DrawerOverlayElementProps as OverlayElementProps,
  type DrawerOverlayProps as OverlayProps,
  type DrawerOverlaySharedElementProps as OverlaySharedElementProps,
} from '@src/Overlay'
import Root, {
  type DrawerRootChildrenProps,
  type DrawerRootProps,
} from '@src/Root'
import type { Side, Size } from '@corvu/utils'
import Trigger, {
  type DrawerTriggerCorvuProps as TriggerCorvuProps,
  type DrawerTriggerElementProps as TriggerElementProps,
  type DrawerTriggerProps as TriggerProps,
  type DrawerTriggerSharedElementProps as TriggerSharedElementProps,
} from '@src/Trigger'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  DrawerRootProps as RootProps,
  DrawerRootChildrenProps as RootChildrenProps,
  TriggerCorvuProps,
  TriggerSharedElementProps,
  TriggerElementProps,
  TriggerProps,
  PortalProps,
  OverlayCorvuProps,
  OverlaySharedElementProps,
  OverlayElementProps,
  OverlayProps,
  ContentCorvuProps,
  ContentSharedElementProps,
  ContentElementProps,
  ContentProps,
  LabelCorvuProps,
  LabelSharedElementProps,
  LabelElementProps,
  LabelProps,
  DescriptionCorvuProps,
  DescriptionSharedElementProps,
  DescriptionElementProps,
  DescriptionProps,
  CloseCorvuProps,
  CloseSharedElementProps,
  CloseElementProps,
  CloseProps,
  DrawerContextValue as ContextValue,
  DialogContextValue,
  Side,
  Size,
  DynamicProps,
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
