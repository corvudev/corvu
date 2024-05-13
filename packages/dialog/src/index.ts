import Close, {
  type DialogCloseCorvuProps as CloseCorvuProps,
  type DialogCloseElementProps as CloseElementProps,
  type DialogCloseProps as CloseProps,
  type DialogCloseSharedElementProps as CloseSharedElementProps,
} from '@src/Close'
import Content, {
  type DialogContentCorvuProps as ContentCorvuProps,
  type DialogContentElementProps as ContentElementProps,
  type DialogContentProps as ContentProps,
  type DialogContentSharedElementProps as ContentSharedElementProps,
} from '@src/Content'
import {
  type DialogContextValue as ContextValue,
  useDialogContext as useContext,
} from '@src/context'
import Description, {
  type DialogDescriptionCorvuProps as DescriptionCorvuProps,
  type DialogDescriptionElementProps as DescriptionElementProps,
  type DialogDescriptionProps as DescriptionProps,
  type DialogDescriptionSharedElementProps as DescriptionSharedElementProps,
} from '@src/Description'
import Label, {
  type DialogLabelCorvuProps as LabelCorvuProps,
  type DialogLabelElementProps as LabelElementProps,
  type DialogLabelProps as LabelProps,
  type DialogLabelSharedElementProps as LabelSharedElementProps,
} from '@src/Label'
import Overlay, {
  type DialogOverlayCorvuProps as OverlayCorvuProps,
  type DialogOverlayElementProps as OverlayElementProps,
  type DialogOverlayProps as OverlayProps,
  type DialogOverlaySharedElementProps as OverlaySharedElementProps,
} from '@src/Overlay'
import Portal, { type DialogPortalProps } from '@src/Portal'
import Root, {
  type DialogRootChildrenProps as RootChildrenProps,
  type DialogRootProps as RootProps,
} from '@src/Root'
import Trigger, {
  type DialogTriggerCorvuProps as TriggerCorvuProps,
  type DialogTriggerElementProps as TriggerElementProps,
  type DialogTriggerProps as TriggerProps,
  type DialogTriggerSharedElementProps as TriggerSharedElementProps,
} from '@src/Trigger'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  RootProps,
  RootChildrenProps,
  TriggerCorvuProps,
  TriggerSharedElementProps,
  TriggerElementProps,
  TriggerProps,
  DialogPortalProps as PortalProps,
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
  ContextValue,
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
}

const Dialog = Object.assign(Root, {
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
  useContext,
})

export default Dialog
