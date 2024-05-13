import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs } from '@corvu/utils/reactivity'
import type { Ref } from '@corvu/utils/dom'
import { useInternalPopoverContext } from '@src/context'

const DEFAULT_POPOVER_ANCHOR_ELEMENT = 'div'

export type PopoverAnchorCorvuProps = {
  /**
   * The `id` of the popover context to use.
   */
  contextId?: string
}

export type PopoverAnchorSharedElementProps = {
  ref: Ref
}
export type PopoverAnchorElementProps = PopoverAnchorSharedElementProps & {
  'data-corvu-popover-anchor': ''
}

export type PopoverAnchorProps = PopoverAnchorCorvuProps &
  Partial<PopoverAnchorSharedElementProps>

/** Anchor element to override the floating reference.
 *
 * @data `data-corvu-popover-anchor` - Present on every popover anchor element.
 */
const PopoverAnchor = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_ANCHOR_ELEMENT,
>(
  props: DynamicProps<T, PopoverAnchorProps, PopoverAnchorElementProps>,
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
      as={DEFAULT_POPOVER_ANCHOR_ELEMENT}
      // === SharedElementProps ===
      ref={mergeRefs(context().setAnchorRef, localProps.ref)}
      // === ElementProps ===
      data-corvu-popover-anchor=""
      {...otherProps}
    />
  )
}

export default PopoverAnchor
