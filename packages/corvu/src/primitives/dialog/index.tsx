import Close, { DialogCloseProps } from '@primitives/dialog/Close'
import Content, { DialogContentProps } from '@primitives/dialog/Content'
import {
  useDialogContext as useContext,
  DialogContextValue,
} from '@primitives/dialog/Context'
import Description, {
  DialogDescriptionProps,
} from '@primitives/dialog/Description'
import Label, { DialogLabelProps } from '@primitives/dialog/Label'
import Overlay, { DialogOverlayProps } from '@primitives/dialog/Overlay'
import Portal, { DialogPortalProps } from '@primitives/dialog/Portal'
import Root, {
  DialogRootChildrenProps,
  DialogRootProps,
} from '@primitives/dialog/Root'
import Trigger, { DialogTriggerProps } from '@primitives/dialog/Trigger'

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
