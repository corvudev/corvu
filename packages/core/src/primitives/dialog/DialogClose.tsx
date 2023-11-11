import { PolymorphicAttributes } from '@lib/components/Polymorphic'
import PolymorphicButton from '@lib/components/PolymorphicButton'
import { callEventHandler } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent, JSX } from 'solid-js'

const DEFAULT_DIALOG_CLOSE_ELEMENT = 'button'

export type DialogCloseProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  }
>

const DialogClose = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  const { setOpen } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as', 'onClick'])

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event,
  ) => {
    !callEventHandler(localProps.onClick, event) && setOpen(false)
  }

  return (
    <PolymorphicButton
      as={localProps.as ?? (DEFAULT_DIALOG_CLOSE_ELEMENT as ValidComponent)}
      onClick={onClick}
      aria-label="close"
      data-corvu-dialog-close
      {...otherProps}
    />
  )
}

export default DialogClose
