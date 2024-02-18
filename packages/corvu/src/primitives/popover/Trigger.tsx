import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import DialogTrigger, {
  DEFAULT_DIALOG_TRIGGER_ELEMENT,
  type DialogTriggerProps,
} from '@primitives/dialog/Trigger'
import { useInternalDialogContext } from '@primitives/dialog/context'
import { useInternalPopoverContext } from '@primitives/popover/context'

/** Button that changes the open state of the popover when clicked.
 *
 * @data `data-corvu-popover-trigger` - Present on every popover trigger element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 * @data `data-placement` - Current placement of the popover. Only present when the popover is open.
 */
const PopoverTrigger = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_TRIGGER_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId'])

  const dialogContext = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <DialogTrigger
      contextId={localProps.contextId}
      data-placement={
        dialogContext().open() ? context().floatingState().placement : undefined
      }
      data-corvu-dialog-trigger={undefined}
      data-corvu-popover-trigger=""
      {...(otherProps as DialogTriggerProps<T>)}
    />
  )
}

export default PopoverTrigger
