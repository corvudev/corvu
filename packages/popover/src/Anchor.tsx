import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import type { ElementOf, Ref } from '@corvu/utils/dom'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalPopoverContext } from '@src/context'

export type PopoverAnchorCorvuProps = {
  /**
   * The `id` of the popover context to use.
   */
  contextId?: string
}

export type PopoverAnchorSharedElementProps<T extends ValidComponent = 'div'> =
  {
    ref: Ref<ElementOf<T>>
  }

export type PopoverAnchorElementProps = PopoverAnchorSharedElementProps & {
  'data-corvu-popover-anchor': ''
}

export type PopoverAnchorProps<T extends ValidComponent = 'div'> =
  PopoverAnchorCorvuProps & Partial<PopoverAnchorSharedElementProps<T>>

/** Anchor element to override the floating reference.
 *
 * @data `data-corvu-popover-anchor` - Present on every popover anchor element.
 */
const PopoverAnchor = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, PopoverAnchorProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as PopoverAnchorProps, [
    'contextId',
    'ref',
  ])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dynamic<PopoverAnchorElementProps>
      as="div"
      // === SharedElementProps ===
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      // === ElementProps ===
      data-corvu-popover-anchor=""
      {...otherProps}
    />
  )
}

export default PopoverAnchor
