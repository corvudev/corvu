import Anchor, { type PopoverAnchorProps } from '@primitives/popover/Anchor'
import Arrow, { type PopoverArrowProps } from '@primitives/popover/Arrow'
import {
  PopoverClose as Close,
  PopoverDescription as Description,
  PopoverLabel as Label,
  PopoverOverlay as Overlay,
} from '@primitives/popover/DialogOverrides'
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
  type PopoverContextValue,
  usePopoverContext as useContext,
} from '@primitives/popover/context'
import Root, {
  type PopoverRootChildrenProps,
  type PopoverRootProps,
} from '@primitives/popover/Root'
import Content from '@primitives/popover/Content'
import Trigger from '@primitives/popover/Trigger'

export type {
  PopoverContextValue as ContextValue,
  DialogContextValue,
  PopoverRootProps as RootProps,
  PopoverRootChildrenProps as RootChildrenProps,
  PopoverAnchorProps as AnchorProps,
  TriggerProps,
  PortalProps,
  OverlayProps,
  ContentProps,
  PopoverArrowProps as ArrowProps,
  LabelProps,
  DescriptionProps,
  CloseProps,
}

export {
  useContext,
  useDialogContext,
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
}

export default {
  useContext,
  useDialogContext,
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
}
