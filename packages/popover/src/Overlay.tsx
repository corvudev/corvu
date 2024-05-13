import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type OverlayCorvuProps as DialogOverlayCorvuProps,
  type OverlayElementProps as DialogOverlayElementProps,
  type OverlaySharedElementProps as DialogOverlaySharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_POPOVER_OVERLAY_ELEMENT = 'div'

export type PopoverOverlayCorvuProps = DialogOverlayCorvuProps

export type PopoverOverlaySharedElementProps = DialogOverlaySharedElementProps

export type PopoverOverlayElementProps = PopoverOverlaySharedElementProps & {
  'data-corvu-popover-overlay': ''
} & DialogOverlayElementProps

export type PopoverOverlayProps = PopoverOverlayCorvuProps &
  Partial<PopoverOverlaySharedElementProps>

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-popover-overlay` - Present on every popover overlay element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 */
const PopoverOverlay = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_OVERLAY_ELEMENT,
>(
  props: DynamicProps<T, PopoverOverlayProps, PopoverOverlayElementProps>,
) => {
  return (
    <Dialog.Overlay<
      Component<
        Omit<PopoverOverlayElementProps, keyof DialogOverlayElementProps>
      >
    >
      as={DEFAULT_POPOVER_OVERLAY_ELEMENT}
      // === ElementProps ===
      data-corvu-popover-overlay=""
      // === Misc ===
      data-corvu-dialog-overlay={null}
      {...(props as PopoverOverlayProps)}
    />
  )
}

export default PopoverOverlay
