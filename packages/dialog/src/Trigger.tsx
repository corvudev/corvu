import { callEventHandler, type Ref } from '@corvu/utils/dom'
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
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_TRIGGER_ELEMENT = 'button'

export type DialogTriggerCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

export type DialogTriggerSharedElementProps = {
  ref: Ref
  onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
} & DynamicButtonSharedElementProps

export type DialogTriggerElementProps = DialogTriggerSharedElementProps & {
  'aria-controls': string
  'aria-expanded': 'true' | 'false'
  'aria-haspopup': 'dialog'
  'data-closed': '' | undefined
  'data-open': '' | undefined
  'data-corvu-dialog-trigger': '' | null
} & DynamicButtonElementProps

export type DialogTriggerProps = DialogTriggerCorvuProps &
  Partial<DialogTriggerSharedElementProps>

/** Button that changes the open state of the dialog when clicked.
 *
 * @data `data-corvu-dialog-trigger` - Present on every dialog trigger element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
>(
  props: DynamicProps<T, DialogTriggerProps, DialogTriggerElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogTriggerProps, [
    'contextId',
    'ref',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().setOpen((open) => !open)
  }

  return (
    <DynamicButton<
      Component<
        Omit<DialogTriggerElementProps, keyof DynamicButtonElementProps>
      >
    >
      as={DEFAULT_DIALOG_TRIGGER_ELEMENT}
      // === SharedElementProps ===
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      onClick={onClick}
      // === ElementProps ===
      aria-controls={context().dialogId()}
      aria-expanded={context().open() ? 'true' : 'false'}
      aria-haspopup="dialog"
      data-closed={dataIf(!context().open())}
      data-open={dataIf(context().open())}
      data-corvu-dialog-trigger=""
      {...otherProps}
    />
  )
}

export default DialogTrigger
