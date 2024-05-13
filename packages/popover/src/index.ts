import Anchor, { type PopoverAnchorProps } from '@src/Anchor'
import Arrow, { type PopoverArrowProps } from '@src/Arrow'
import {
  PopoverClose as Close,
  PopoverDescription as Description,
  PopoverLabel as Label,
  PopoverOverlay as Overlay,
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
import type {
  FloatingOptions,
  FloatingState,
} from '@corvu/utils/create/floating'
import {
  type PopoverContextValue,
  usePopoverContext as useContext,
} from '@src/context'
import Root, {
  type PopoverRootChildrenProps,
  type PopoverRootProps,
} from '@src/Root'
import Content from '@src/Content'
import Trigger from '@src/Trigger'

export type {
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
  PopoverContextValue as ContextValue,
  DialogContextValue,
  FloatingOptions,
  FloatingState,
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
