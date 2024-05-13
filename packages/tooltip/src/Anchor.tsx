import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import type { Ref } from '@corvu/utils/dom'
import { useInternalTooltipContext } from '@src/context'

const DEFAULT_TOOLTIP_ANCHOR_ELEMENT = 'div'

export type TooltipAnchorCorvuProps = {
  /**
   * The `id` of the tooltip context to use.
   */
  contextId?: string
}

export type TooltipAnchorSharedElementProps = {
  ref: Ref
}

export type TooltipAnchorElementProps = TooltipAnchorSharedElementProps & {
  'data-corvu-tooltip-anchor': ''
}

export type TooltipAnchorProps = TooltipAnchorCorvuProps &
  Partial<TooltipAnchorSharedElementProps>

/** Anchor element to override the floating reference.
 *
 * @data `data-corvu-tooltip-anchor` - Present on every tooltip anchor element.
 */
const TooltipAnchor = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_ANCHOR_ELEMENT,
>(
  props: DynamicProps<T, TooltipAnchorProps, TooltipAnchorElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as TooltipAnchorProps, [
    'contextId',
    'ref',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <Dynamic<TooltipAnchorElementProps>
      as={DEFAULT_TOOLTIP_ANCHOR_ELEMENT}
      // === SharedElementProps ===
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      // === ElementProps ===
      data-corvu-tooltip-anchor=""
      {...otherProps}
    />
  )
}

export default TooltipAnchor
