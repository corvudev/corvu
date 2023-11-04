import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { callEventHandler } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent, JSX } from 'solid-js'

const DEFAULT_DIALOG_CLOSE_ELEMENT = 'button' as ValidComponent

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
  const { onOpenChange } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as', 'onClick'])

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event,
  ) => {
    !callEventHandler(localProps.onClick, event) && onOpenChange(false)
  }

  return (
    <Polymorphic
      as={localProps.as ?? DEFAULT_DIALOG_CLOSE_ELEMENT}
      onClick={onClick}
      type="button"
      role="button"
      aria-label="close"
      {...otherProps}
    />
  )
}

export default DialogClose
