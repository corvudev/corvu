import type {
  DEFAULT_DIALOG_CLOSE_ELEMENT,
  DialogCloseProps,
} from '@primitives/dialog/Close'
import type {
  DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
  DialogDescriptionProps,
} from '@primitives/dialog/Description'
import DialogClose from '@primitives/dialog/Close'
import DialogDescription from '@primitives/dialog/Description'
import DialogLabel from '@primitives/dialog/Label'
import type { DialogLabelProps } from '@primitives/dialog/Label'
import DialogOverlay from '@primitives/dialog/Overlay'
import type { DialogOverlayProps } from '@primitives/dialog/Overlay'
import DialogTrigger from '@primitives/dialog/Trigger'
import type { DialogTriggerProps } from '@primitives/dialog/Trigger'
import type { ValidComponent } from 'solid-js'

const PopoverClose = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  return (
    <DialogClose
      data-corvu-dialog-close={undefined}
      data-corvu-popover-close=""
      {...props}
    />
  )
}

const PopoverDescription = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  return (
    <DialogDescription
      data-corvu-dialog-description={undefined}
      data-corvu-popover-description=""
      {...props}
    />
  )
}

const PopoverLabel = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  return (
    <DialogLabel
      data-corvu-dialog-label={undefined}
      data-corvu-popover-label=""
      {...props}
    />
  )
}

const PopoverOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  return (
    <DialogOverlay
      data-corvu-dialog-overlay={undefined}
      data-corvu-popover-overlay=""
      {...props}
    />
  )
}

const PopoverTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  return (
    <DialogTrigger
      data-corvu-dialog-trigger={undefined}
      data-corvu-popover-PopoverTrigger=""
      {...props}
    />
  )
}

export {
  PopoverClose,
  PopoverDescription,
  PopoverLabel,
  PopoverOverlay,
  PopoverTrigger,
}
