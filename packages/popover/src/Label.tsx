import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type LabelCorvuProps as DialogLabelCorvuProps,
  type LabelElementProps as DialogLabelElementProps,
  type LabelSharedElementProps as DialogLabelSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type PopoverLabelCorvuProps = DialogLabelCorvuProps

export type PopoverLabelSharedElementProps<T extends ValidComponent = 'h2'> =
  DialogLabelSharedElementProps<T>

export type PopoverLabelElementProps = PopoverLabelSharedElementProps & {
  'data-corvu-popover-label': ''
} & DialogLabelElementProps

export type PopoverLabelProps<T extends ValidComponent = 'h2'> =
  PopoverLabelCorvuProps & Partial<PopoverLabelSharedElementProps<T>>

/** Label element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-label` - Present on every popover label element.
 */
const PopoverLabel = <T extends ValidComponent = 'h2'>(
  props: DynamicProps<T, PopoverLabelProps<T>>,
) => {
  return (
    <Dialog.Label<
      Component<Omit<PopoverLabelElementProps, keyof DialogLabelElementProps>>
    >
      // === ElementProps ===
      data-corvu-popover-label=""
      // === Misc ===
      data-corvu-dialog-label={null}
      {...(props as PopoverLabelProps)}
    />
  )
}

export default PopoverLabel
