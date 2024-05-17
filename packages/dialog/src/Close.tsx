import { callEventHandler, type ElementOf } from '@corvu/utils/dom'
import {
  type Component,
  createMemo,
  type JSX,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  DynamicButton,
  type DynamicButtonElementProps,
  type DynamicButtonSharedElementProps,
  type DynamicProps,
} from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export type DialogCloseCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

export type DialogCloseSharedElementProps<T extends ValidComponent = 'button'> =
  {
    onClick: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
  } & DynamicButtonSharedElementProps<T>

export type DialogCloseElementProps = DialogCloseSharedElementProps & {
  'aria-label': 'close'
  'data-corvu-dialog-close': '' | null
} & DynamicButtonElementProps

export type DialogCloseProps<T extends ValidComponent = 'button'> =
  DialogCloseCorvuProps & Partial<DialogCloseSharedElementProps<T>>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-dialog-close` - Present on every dialog close element.
 */
const DialogClose = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, DialogCloseProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogCloseProps, [
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
    <DynamicButton<
      Component<Omit<DialogCloseElementProps, keyof DynamicButtonElementProps>>
    >
      // === SharedElementProps ===
      onClick={onClick}
      // === ElementProps ===
      aria-label="close"
      data-corvu-dialog-close=""
      {...otherProps}
    />
  )
}

export default DialogClose
