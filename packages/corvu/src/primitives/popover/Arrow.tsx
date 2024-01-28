import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import type {
  DEFAULT_FLOATING_ARROW_ELEMENT,
  FloatingArrowProps,
} from '@lib/components/floating/FloatingArrow'
import FloatingArrow from '@lib/components/floating/FloatingArrow'
import type { OverrideComponentProps } from '@lib/types'
import type { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { useInternalPopoverContext } from '@primitives/popover/context'

export type PopoverArrowProps<
  T extends ValidComponent = typeof DEFAULT_FLOATING_ARROW_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /**
     * Size of the arrow in px.
     * @default 16
     */
    size?: number
    /**
     * The `id` of the popover context to use.
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
 * @data `data-corvu-popover-arrow` - Present on every popover arrow element.
 */
const PopoverArrow = <
  T extends ValidComponent = typeof DEFAULT_FLOATING_ARROW_ELEMENT,
>(
  props: PopoverArrowProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId'])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <FloatingArrow
      setRef={context().setArrowRef}
      floatingState={context().floatingState()}
      data-corvu-popover-arrow=""
      {...(otherProps as FloatingArrowProps<T>)}
    />
  )
}

export default PopoverArrow
