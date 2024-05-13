import Close, { type DialogCloseProps } from '@src/Close'
import Content, { type DialogContentProps } from '@src/Content'
import Description, { type DialogDescriptionProps } from '@src/Description'
import {
  type DialogContextValue,
  useDialogContext as useContext,
} from '@src/context'
import Label, { type DialogLabelProps } from '@src/Label'
import Overlay, { type DialogOverlayProps } from '@src/Overlay'
import Portal, { type DialogPortalProps } from '@src/Portal'
import Root, {
  type DialogRootChildrenProps,
  type DialogRootProps,
} from '@src/Root'
import Trigger, { type DialogTriggerProps } from '@src/Trigger'

export type {
  DialogRootProps as RootProps,
  DialogRootChildrenProps as RootChildrenProps,
  DialogTriggerProps as TriggerProps,
  DialogPortalProps as PortalProps,
  DialogOverlayProps as OverlayProps,
  DialogContentProps as ContentProps,
  DialogLabelProps as LabelProps,
  DialogDescriptionProps as DescriptionProps,
  DialogCloseProps as CloseProps,
  DialogContextValue as ContextValue,
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
