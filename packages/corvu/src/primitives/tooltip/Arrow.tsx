import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import type {
  DEFAULT_FLOATING_ARROW_ELEMENT,
  FloatingArrowProps,
} from '@lib/components/floating/FloatingArrow'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import FloatingArrow from '@lib/components/floating/FloatingArrow'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

export type TooltipArrowProps<
  T extends ValidComponent = typeof DEFAULT_FLOATING_ARROW_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * Size of the arrow in px.
     * @defaultValue 16
     * */
    size?: number
    /**
     * The `id` of the tooltip context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

/** Arrow element that automatically points towards the floating reference. Comes with a default arrow svg, but can be overridden by providing your own as the children.
 *
 * @data `data-corvu-tooltip-arrow` - Present on every tooltip arrow element.
 */
const TooltipArrow = <
  T extends ValidComponent = typeof DEFAULT_FLOATING_ARROW_ELEMENT,
>(
  props: TooltipArrowProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId'])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <FloatingArrow
      setRef={context().setArrowRef}
      floatingState={context().floatingState()}
      data-corvu-tooltip-arrow=""
      {...(otherProps as FloatingArrowProps<T>)}
    />
  )
}

export default TooltipArrow
