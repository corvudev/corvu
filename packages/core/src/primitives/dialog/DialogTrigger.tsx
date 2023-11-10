import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { OverrideComponentProps } from '@lib/types'
import { callEventHandler, dataIf } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

const DEFAULT_DIALOG_TRIGGER_ELEMENT = 'button'

export type DialogTriggerProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  }
>

const DialogTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  const { open, setOpen, dialogId } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as', 'onClick'])

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) && setOpen((open) => !open)
  }

  return (
    <Polymorphic
      as={localProps.as ?? (DEFAULT_DIALOG_TRIGGER_ELEMENT as ValidComponent)}
      onClick={onClick}
      type="button"
      role="button"
      aria-haspopup="dialog"
      aria-expanded={open() ? 'true' : 'false'}
      aria-controls={dialogId}
      data-open={dataIf(open())}
      data-closed={dataIf(!open())}
      data-corvu-dialog-trigger
      {...otherProps}
    />
  )
}

export default DialogTrigger
