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
import { callEventHandler } from '@corvu/utils/dom'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_CLOSE_ELEMENT = 'button'

export type DialogCloseCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

export type DialogCloseSharedElementProps = {
  onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
} & DynamicButtonSharedElementProps

export type DialogCloseElementProps = DialogCloseSharedElementProps & {
  'aria-label': 'close'
  'data-corvu-dialog-close': '' | null
} & DynamicButtonElementProps

export type DialogCloseProps = DialogCloseCorvuProps &
  Partial<DialogCloseSharedElementProps>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-dialog-close` - Present on every dialog close element.
 */
const DialogClose = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CLOSE_ELEMENT,
>(
  props: DynamicProps<T, DialogCloseProps, DialogCloseElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogCloseProps, [
    'contextId',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (event) => {
    !callEventHandler(localProps.onClick, event) && context().setOpen(false)
  }

  return (
    <DynamicButton<
      Component<Omit<DialogCloseElementProps, keyof DynamicButtonElementProps>>
    >
      as={DEFAULT_DIALOG_CLOSE_ELEMENT}
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
