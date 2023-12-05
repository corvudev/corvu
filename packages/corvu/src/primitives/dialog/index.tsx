import Close, { DialogCloseProps } from '@primitives/dialog/DialogClose'
import Content, { DialogContentProps } from '@primitives/dialog/DialogContent'
import {
  useDialogContext as useContext,
  DialogContextValue,
} from '@primitives/dialog/DialogContext'
import Description, {
  DialogDescriptionProps,
} from '@primitives/dialog/DialogDescription'
import Label, { DialogLabelProps } from '@primitives/dialog/DialogLabel'
import Overlay, { DialogOverlayProps } from '@primitives/dialog/DialogOverlay'
import Portal, { DialogPortalProps } from '@primitives/dialog/DialogPortal'
import Root, {
  DialogRootChildrenProps,
  DialogRootProps,
} from '@primitives/dialog/DialogRoot'
import Trigger, { DialogTriggerProps } from '@primitives/dialog/DialogTrigger'

export type {
  DialogContextValue as ContextValue,
  DialogRootChildrenProps as RootChildrenProps,
  DialogRootProps as RootProps,
  DialogTriggerProps as TriggerProps,
  DialogPortalProps as PortalProps,
  DialogOverlayProps as OverlayProps,
  DialogContentProps as ContentProps,
  DialogLabelProps as LabelProps,
  DialogDescriptionProps as DescriptionProps,
  DialogCloseProps as CloseProps,
}

export {
  useContext,
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
  useContext,
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
}
