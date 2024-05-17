import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type OverlayCorvuProps as DialogOverlayCorvuProps,
  type OverlayElementProps as DialogOverlayElementProps,
  type OverlaySharedElementProps as DialogOverlaySharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type PopoverOverlayCorvuProps = DialogOverlayCorvuProps

export type PopoverOverlaySharedElementProps<T extends ValidComponent = 'div'> =
  DialogOverlaySharedElementProps<T>

export type PopoverOverlayElementProps = PopoverOverlaySharedElementProps & {
  'data-corvu-popover-overlay': ''
} & DialogOverlayElementProps

export type PopoverOverlayProps<T extends ValidComponent = 'div'> =
  PopoverOverlayCorvuProps & Partial<PopoverOverlaySharedElementProps<T>>

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-popover-overlay` - Present on every popover overlay element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 */
const PopoverOverlay = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, PopoverOverlayProps<T>>,
) => {
  return (
    <Dialog.Overlay<
      Component<
        Omit<PopoverOverlayElementProps, keyof DialogOverlayElementProps>
      >
    >
      // === ElementProps ===
      data-corvu-popover-overlay=""
      // === Misc ===
      data-corvu-dialog-overlay={null}
      {...(props as PopoverOverlayProps)}
    />
  )
}

export default PopoverOverlay
