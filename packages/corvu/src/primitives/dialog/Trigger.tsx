import { callEventHandler, dataIf, mergeRefs } from '@lib/utils'
import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { PolymorphicAttributes } from '@lib/components/Polymorphic'
import PolymorphicButton from '@lib/components/PolymorphicButton'
import { useInternalDialogContext } from '@primitives/dialog/context'

const DEFAULT_DIALOG_TRIGGER_ELEMENT = 'button'

export type DialogTriggerProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** The `id` of the dialog context to use. */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
    /** @hidden */
    'data-corvu-dialog-trigger'?: string | undefined
  }
>

/** Button that changes the open state of the dialog when clicked.
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
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'ref',
    'onClick',
    'data-corvu-dialog-trigger',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().setOpen((open) => !open)
  }

  return (
    <PolymorphicButton
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      as={localProps.as ?? (DEFAULT_DIALOG_TRIGGER_ELEMENT as ValidComponent)}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={context().open() ? 'true' : 'false'}
      aria-controls={context().dialogId()}
      data-open={dataIf(context().open())}
      data-closed={dataIf(!context().open())}
      data-corvu-dialog-trigger={
        localProps.hasOwnProperty('data-corvu-dialog-trigger')
          ? localProps['data-corvu-dialog-trigger']
          : ''
      }
      {...otherProps}
    />
  )
}

export default DialogTrigger
