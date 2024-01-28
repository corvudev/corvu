import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { mergeRefs } from '@lib/utils'
import type { OverrideComponentProps } from '@lib/types'
import Polymorphic from '@lib/components/Polymorphic'
import type { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { useInternalPopoverContext } from '@primitives/popover/context'

const DEFAULT_POPOVER_ANCHOR_ELEMENT = 'div'

export type PopoverAnchorProps<
  T extends ValidComponent = typeof DEFAULT_POPOVER_ANCHOR_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
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
    <Polymorphic
      as={localProps.as ?? (DEFAULT_POPOVER_ANCHOR_ELEMENT as ValidComponent)}
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      data-corvu-popover-anchor
      {...otherProps}
    />
  )
}

export default PopoverAnchor
