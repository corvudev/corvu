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
import DialogTrigger from '@primitives/dialog/Trigger'
import type { DialogTriggerProps } from '@primitives/dialog/Trigger'
import type { ValidComponent } from 'solid-js'

const DrawerClose = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  return (
    <DialogClose
      data-corvu-dialog-close={undefined}
      data-corvu-drawer-close=""
      {...props}
    />
  )
}

const DrawerDescription = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  return (
    <DialogDescription
      data-corvu-dialog-description={undefined}
      data-corvu-drawer-description=""
      {...props}
    />
  )
}

const DrawerLabel = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  return (
    <DialogLabel
      data-corvu-dialog-label={undefined}
      data-corvu-drawer-label=""
      {...props}
    />
  )
}

const DrawerTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  return (
    <DialogTrigger
      data-corvu-dialog-trigger={undefined}
      data-corvu-drawer-DrawerTrigger=""
      {...props}
    />
  )
}

export { DrawerClose, DrawerDescription, DrawerLabel, DrawerTrigger }
