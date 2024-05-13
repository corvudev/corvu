import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import FloatingArrow, {
  type FloatingArrowElementProps,
  type FloatingArrowSharedElementProps,
} from '@corvu/utils/components/FloatingArrow'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import type { Ref } from '@corvu/utils/dom'
import { useInternalTooltipContext } from '@src/context'

const DEFAULT_TOOLTIP_ARROW_ELEMENT = 'div'

export type TooltipArrowCorvuProps = {
  /**
   * Size of the arrow in px.
   * @defaultValue 16
   */
  size?: number
  /**
   * The `id` of the tooltip context to use.
   */
  contextId?: string
}

export type TooltipArrowSharedElementProps = {
  ref: Ref
} & FloatingArrowSharedElementProps

export type TooltipArrowElementProps = TooltipArrowSharedElementProps & {
  'data-corvu-tooltip-arrow': ''
} & FloatingArrowElementProps

export type TooltipArrowProps = TooltipArrowCorvuProps &
  Partial<TooltipArrowSharedElementProps>

/** Arrow element that automatically points towards the floating reference. Comes with a default arrow svg, but can be overridden by providing your own as the children.
 *
 * @data `data-corvu-tooltip-arrow` - Present on every tooltip arrow element.
 */
const TooltipArrow = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_ARROW_ELEMENT,
>(
  props: DynamicProps<T, TooltipArrowProps, TooltipArrowElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as TooltipArrowProps, [
    'contextId',
    'ref',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <FloatingArrow<Component<TooltipArrowElementProps>>
      as={DEFAULT_TOOLTIP_ARROW_ELEMENT}
      floatingState={context().floatingState()}
      // === SharedElementProps ===
      ref={mergeRefs(context().setArrowRef, localProps.ref)}
      data-corvu-tooltip-arrow=""
      {...otherProps}
    />
  )
}

export default TooltipArrow
