import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type {
  TriggerCorvuProps as DialogTriggerCorvuProps,
  TriggerElementProps as DialogTriggerElementProps,
  TriggerSharedElementProps as DialogTriggerSharedElementProps,
} from '@corvu/dialog'
import Dialog from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import type { Placement } from '@floating-ui/dom'
import { useInternalPopoverContext } from '@src/context'

const DEFAULT_POPOVER_TRIGGER_ELEMENT = 'button'

export type PopoverTriggerCorvuProps = DialogTriggerCorvuProps

export type PopoverTriggerSharedElementProps = DialogTriggerSharedElementProps

export type PopoverTriggerElementProps = PopoverTriggerSharedElementProps & {
  'data-placement': Placement | undefined
  'data-corvu-popover-trigger': ''
} & DialogTriggerElementProps

export type PopoverTriggerProps = PopoverTriggerCorvuProps &
  Partial<PopoverTriggerSharedElementProps>

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
  props: DynamicProps<T, PopoverTriggerProps, PopoverTriggerElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as PopoverTriggerProps, [
    'ref',
    'contextId',
  ])

  const dialogContext = createMemo(() =>
    Dialog.useContext(localProps.contextId),
  )

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dialog.Trigger<
      Component<
        Omit<PopoverTriggerElementProps, keyof DialogTriggerElementProps>
      >
    >
      as={DEFAULT_POPOVER_TRIGGER_ELEMENT}
      contextId={localProps.contextId}
      // === SharedElementProps ===
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      // === ElementProps ===
      data-placement={
        dialogContext().open() ? context().floatingState().placement : undefined
      }
      data-corvu-popover-trigger=""
      // === Misc ===
      data-corvu-dialog-trigger={null}
      {...otherProps}
    />
  )
}

export default PopoverTrigger
