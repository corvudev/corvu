import { PolymorphicAttributes } from '@lib/components/Polymorphic'
import PolymorphicButton from '@lib/components/PolymorphicButton'
import { callEventHandler } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { createMemo, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent, JSX } from 'solid-js'

const DEFAULT_DIALOG_CLOSE_ELEMENT = 'button'

export type DialogCloseProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** The `id` of the dialog context to use. */
    contextId?: string
    /** @hidden */
    onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
  }
>

/** Close button which changes the open state to closed when clicked.
 *
 * @data `data-corvu-dialog-close` - Present on every dialog close element.
 */
const DialogClose = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    event,
  ) => {
    !callEventHandler(localProps.onClick, event) && context().setOpen(false)
  }

  return (
    <PolymorphicButton
      as={localProps.as ?? (DEFAULT_DIALOG_CLOSE_ELEMENT as ValidComponent)}
      onClick={onClick}
      aria-label="close"
      data-corvu-dialog-close=""
      {...otherProps}
    />
  )
}

export default DialogClose
