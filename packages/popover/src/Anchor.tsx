import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import {
  Dynamic,
  type DynamicAttributes,
  type OverrideComponentProps,
} from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalPopoverContext } from '@src/context'

const DEFAULT_POPOVER_ANCHOR_ELEMENT = 'div'

export type PopoverAnchorProps<
  T extends ValidComponent = typeof DEFAULT_POPOVER_ANCHOR_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the popover context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
  }
>

/** Anchor element to override the floating reference.
 *
 * @data `data-corvu-popover-anchor` - Present on every popover anchor element.
 */
const PopoverAnchor = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_ANCHOR_ELEMENT,
>(
  props: PopoverAnchorProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['as', 'contextId', 'ref'])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dynamic
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_POPOVER_ANCHOR_ELEMENT
      }
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      data-corvu-popover-anchor
      {...otherProps}
    />
  )
}

export default PopoverAnchor
