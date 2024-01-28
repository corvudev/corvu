import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { mergeRefs } from '@lib/utils'
import type { OverrideComponentProps } from '@lib/types'
import Polymorphic from '@lib/components/Polymorphic'
import type { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

const DEFAULT_TOOLTIP_ANCHOR_ELEMENT = 'div'

export type TooltipAnchorProps<
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_ANCHOR_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /**
     * The `id` of the tooltip context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
  }
>

/** Anchor element to override the floating reference.
 *
 * @data `data-corvu-tooltip-anchor` - Present on every tooltip anchor element.
 */
const TooltipAnchor = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_ANCHOR_ELEMENT,
>(
  props: TooltipAnchorProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['as', 'contextId', 'ref'])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <Polymorphic
      as={localProps.as ?? (DEFAULT_TOOLTIP_ANCHOR_ELEMENT as ValidComponent)}
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      data-corvu-tooltip-anchor
      {...otherProps}
    />
  )
}

export default TooltipAnchor
