import type {
  DEFAULT_DIALOG_CLOSE_ELEMENT,
  DialogCloseProps,
} from '@primitives/dialog/Close'
import type {
  DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
  DialogDescriptionProps,
} from '@primitives/dialog/Description'
import type {
  DEFAULT_DIALOG_LABEL_ELEMENT,
  DialogLabelProps,
} from '@primitives/dialog/Label'
import type {
  DEFAULT_DIALOG_OVERLAY_ELEMENT,
  DialogOverlayProps,
} from '@primitives/dialog/Overlay'
import DialogClose from '@primitives/dialog/Close'
import DialogDescription from '@primitives/dialog/Description'
import DialogLabel from '@primitives/dialog/Label'
import DialogOverlay from '@primitives/dialog/Overlay'
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
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
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
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
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

export { PopoverClose, PopoverDescription, PopoverLabel, PopoverOverlay }
