import Dialog, {
  type CloseProps as DialogCloseProps,
  type DescriptionProps as DialogDescriptionProps,
  type LabelProps as DialogLabelProps,
  type OverlayProps as DialogOverlayProps,
} from '@corvu/dialog'
import type { ValidComponent } from 'solid-js'

const DEFAULT_POPOVER_CLOSE_ELEMENT = 'button'
const DEFAULT_POPOVER_DESCRIPTION_ELEMENT = 'p'
const DEFAULT_POPOVER_LABEL_ELEMENT = 'h2'
const DEFAULT_POPOVER_OVERLAY_ELEMENT = 'div'

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-popover-close` - Present on every popover close element.
 */
const PopoverClose = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  return (
    <Dialog.Close
      data-corvu-dialog-close={undefined}
      data-corvu-popover-close=""
      {...props}
    />
  )
}

/** Description element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-description` - Present on every popover description element.
 */
const PopoverDescription = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  return (
    <Dialog.Description
      data-corvu-dialog-description={undefined}
      data-corvu-popover-description=""
      {...props}
    />
  )
}

/** Label element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-label` - Present on every popover label element.
 */
const PopoverLabel = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_LABEL_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  return (
    <Dialog.Label
      data-corvu-dialog-label={undefined}
      data-corvu-popover-label=""
      {...props}
    />
  )
}

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-popover-overlay` - Present on every popover overlay element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 */
const PopoverOverlay = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  return (
    <Dialog.Overlay
      data-corvu-dialog-overlay={undefined}
      data-corvu-popover-overlay=""
      {...props}
    />
  )
}

export { PopoverClose, PopoverDescription, PopoverLabel, PopoverOverlay }
