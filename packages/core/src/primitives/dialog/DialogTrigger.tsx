import { PolymorphicAttributes } from '@lib/components/Polymorphic'
import PolymorphicButton from '@lib/components/PolymorphicButton'
import { OverrideComponentProps } from '@lib/types'
import { callEventHandler, dataIf } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'

const DEFAULT_DIALOG_TRIGGER_ELEMENT = 'button'

export type DialogTriggerProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** @hidden */
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  }
>

/** Button which changes the open state when clicked
 *
 * @data `data-corvu-dialog-trigger` - Present on every dialog trigger element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  const { open, setOpen, dialogId } = useInternalDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as', 'onClick'])

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) && setOpen((open) => !open)
  }

  return (
    <PolymorphicButton
      as={localProps.as ?? (DEFAULT_DIALOG_TRIGGER_ELEMENT as ValidComponent)}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={open() ? 'true' : 'false'}
      aria-controls={dialogId()}
      data-open={dataIf(open())}
      data-closed={dataIf(!open())}
      data-corvu-dialog-trigger
      {...otherProps}
    />
  )
}

export default DialogTrigger
