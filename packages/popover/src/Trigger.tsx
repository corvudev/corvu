import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import Dialog from '@corvu/dialog'
import type { TriggerProps as DialogTriggerProps } from '@corvu/dialog'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalPopoverContext } from '@src/context'

const DEFAULT_POPOVER_TRIGGER_ELEMENT = 'button'

/** Button that changes the open state of the popover when clicked.
 *
 * @data `data-corvu-popover-trigger` - Present on every popover trigger element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 * @data `data-placement` - Current placement of the popover. Only present when the popover is open.
 */
const PopoverTrigger = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_TRIGGER_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['ref', 'contextId'])

  const dialogContext = createMemo(() =>
    Dialog.useContext(localProps.contextId),
  )

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dialog.Trigger
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
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
