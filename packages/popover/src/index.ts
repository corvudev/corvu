import Anchor, {
  type PopoverAnchorCorvuProps as AnchorCorvuProps,
  type PopoverAnchorElementProps as AnchorElementProps,
  type PopoverAnchorProps as AnchorProps,
  type PopoverAnchorSharedElementProps as AnchorSharedElementProps,
} from '@src/Anchor'
import Arrow, {
  type PopoverArrowCorvuProps as ArrowCorvuProps,
  type PopoverArrowElementProps as ArrowElementProps,
  type PopoverArrowProps as ArrowProps,
  type PopoverArrowSharedElementProps as ArrowSharedElementProps,
} from '@src/Arrow'
import Close, {
  type PopoverCloseCorvuProps as CloseCorvuProps,
  type PopoverCloseElementProps as CloseElementProps,
  type PopoverCloseProps as CloseProps,
  type PopoverCloseSharedElementProps as CloseSharedElementProps,
} from '@src/Close'
import Content, {
  type PopoverContentCorvuProps as ContentCorvuProps,
  type PopoverContentElementProps as ContentElementProps,
  type PopoverContentProps as ContentProps,
  type PopoverContentSharedElementProps as ContentSharedElementProps,
} from '@src/Content'
import Description, {
  type PopoverDescriptionCorvuProps as DescriptionCorvuProps,
  type PopoverDescriptionElementProps as DescriptionElementProps,
  type PopoverDescriptionProps as DescriptionProps,
  type PopoverDescriptionSharedElementProps as DescriptionSharedElementProps,
} from '@src/Description'
import {
  type ContextValue as DialogContextValue,
  Portal,
  type PortalProps,
  useContext as useDialogContext,
} from '@corvu/dialog'
import type {
  FloatingOptions,
  FloatingState,
} from '@corvu/utils/create/floating'
import Label, {
  type PopoverLabelCorvuProps as LabelCorvuProps,
  type PopoverLabelElementProps as LabelElementProps,
  type PopoverLabelProps as LabelProps,
  type PopoverLabelSharedElementProps as LabelSharedElementProps,
} from '@src/Label'
import Overlay, {
  type PopoverOverlayCorvuProps as OverlayCorvuProps,
  type PopoverOverlayElementProps as OverlayElementProps,
  type PopoverOverlayProps as OverlayProps,
  type PopoverOverlaySharedElementProps as OverlaySharedElementProps,
} from '@src/Overlay'
import {
  type PopoverContextValue,
  usePopoverContext as useContext,
} from '@src/context'
import Root, {
  type PopoverRootChildrenProps,
  type PopoverRootProps,
} from '@src/Root'
import Trigger, {
  type PopoverTriggerCorvuProps as TriggerCorvuProps,
  type PopoverTriggerElementProps as TriggerElementProps,
  type PopoverTriggerProps as TriggerProps,
  type PopoverTriggerSharedElementProps as TriggerSharedElementProps,
} from '@src/Trigger'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  PopoverRootProps as RootProps,
  PopoverRootChildrenProps as RootChildrenProps,
  AnchorCorvuProps,
  AnchorSharedElementProps,
  AnchorElementProps,
  AnchorProps,
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
  ArrowCorvuProps,
  ArrowSharedElementProps,
  ArrowElementProps,
  ArrowProps,
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
  PopoverContextValue as ContextValue,
  DialogContextValue,
  FloatingOptions,
  FloatingState,
  DynamicProps,
}

export {
  Root,
  Anchor,
  Trigger,
  Portal,
  Overlay,
  Content,
  Arrow,
  Label,
  Description,
  Close,
  useContext,
  useDialogContext,
}

const Popover = Object.assign(Root, {
  Anchor,
  Trigger,
  Portal,
  Overlay,
  Content,
  Arrow,
  Label,
  Description,
  Close,
  useContext,
  useDialogContext,
})

export default Popover
