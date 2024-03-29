import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import { callEventHandler } from '@lib/utils'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import DynamicButton from '@lib/components/DynamicButton'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/context'

export const DEFAULT_DIALOG_CLOSE_ELEMENT = 'button'

export type DialogCloseProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the dialog context to use.
     */
    contextId?: string
    /** @hidden */
    onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
    /** @hidden */
    'data-corvu-dialog-close'?: string | undefined
  }
>

/** Close button that changes the open state to false when clicked.
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
    'data-corvu-dialog-close',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (event) => {
    !callEventHandler(localProps.onClick, event) && context().setOpen(false)
  }

  return (
    <DynamicButton
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_DIALOG_CLOSE_ELEMENT
      }
      onClick={onClick}
      aria-label="close"
      data-corvu-dialog-close={
        localProps.hasOwnProperty('data-corvu-dialog-close')
          ? localProps['data-corvu-dialog-close']
          : ''
      }
      {...otherProps}
    />
  )
}

export default DialogClose
