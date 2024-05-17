import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type { ElementOf, Ref } from '@corvu/utils/dom'
import FloatingArrow, {
  type FloatingArrowElementProps,
  type FloatingArrowSharedElementProps,
} from '@corvu/utils/components/FloatingArrow'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalTooltipContext } from '@src/context'

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

export type TooltipArrowSharedElementProps<T extends ValidComponent = 'div'> = {
  ref: Ref<ElementOf<T>>
} & FloatingArrowSharedElementProps<T>

export type TooltipArrowElementProps = TooltipArrowSharedElementProps & {
  'data-corvu-tooltip-arrow': ''
} & FloatingArrowElementProps

export type TooltipArrowProps<T extends ValidComponent = 'div'> =
  TooltipArrowCorvuProps & Partial<TooltipArrowSharedElementProps<T>>

/** Arrow element that automatically points towards the floating reference. Comes with a default arrow svg, but can be overridden by providing your own as the children.
 *
 * @data `data-corvu-tooltip-arrow` - Present on every tooltip arrow element.
 */
const TooltipArrow = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, TooltipArrowProps<T>>,
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
      floatingState={context().floatingState()}
      // === SharedElementProps ===
      ref={mergeRefs(context().setArrowRef, localProps.ref)}
      data-corvu-tooltip-arrow=""
      {...otherProps}
    />
  )
}

export default TooltipArrow
