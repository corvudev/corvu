import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type { ElementOf, Ref } from '@corvu/utils/dom'
import type {
  FloatingArrowElementProps,
  FloatingArrowSharedElementProps,
} from '@corvu/utils/components/FloatingArrow'
import type { DynamicProps } from '@corvu/utils/dynamic'
import FloatingArrow from '@corvu/utils/components/FloatingArrow'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalPopoverContext } from '@src/context'

export type PopoverArrowCorvuProps = {
  /**
   * Size of the arrow in px.
   * @defaultValue 16
   */
  size?: number
  /**
   * The `id` of the popover context to use.
   */
  contextId?: string
}

export type PopoverArrowSharedElementProps<T extends ValidComponent = 'div'> = {
  ref: Ref<ElementOf<T>>
} & FloatingArrowSharedElementProps<T>

export type PopoverArrowElementProps = PopoverArrowSharedElementProps & {
  'data-corvu-popover-arrow': ''
} & FloatingArrowElementProps

export type PopoverArrowProps<T extends ValidComponent = 'div'> =
  PopoverArrowCorvuProps & Partial<PopoverArrowSharedElementProps<T>>

/** Arrow element that automatically points towards the floating reference. Comes with a default arrow svg, but can be overridden by providing your own as the children.
 *
 * @data `data-corvu-popover-arrow` - Present on every popover arrow element.
 */
const PopoverArrow = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, PopoverArrowProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as PopoverArrowProps, [
    'contextId',
    'ref',
  ])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <FloatingArrow<Component<PopoverArrowElementProps>>
      floatingState={context().floatingState()}
      // === SharedElementProps ===
      ref={mergeRefs(context().setArrowRef, localProps.ref)}
      data-corvu-popover-arrow=""
      {...otherProps}
    />
  )
}

export default PopoverArrow
