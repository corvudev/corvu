import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type LabelCorvuProps as DialogLabelCorvuProps,
  type LabelElementProps as DialogLabelElementProps,
  type LabelSharedElementProps as DialogLabelSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_POPOVER_LABEL_ELEMENT = 'h2'

export type PopoverLabelCorvuProps = DialogLabelCorvuProps

export type PopoverLabelSharedElementProps = DialogLabelSharedElementProps

export type PopoverLabelElementProps = PopoverLabelSharedElementProps & {
  'data-corvu-popover-label': ''
} & DialogLabelElementProps

export type PopoverLabelProps = PopoverLabelCorvuProps &
  Partial<PopoverLabelSharedElementProps>

/** Label element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-label` - Present on every popover label element.
 */
const PopoverLabel = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_LABEL_ELEMENT,
>(
  props: DynamicProps<T, PopoverLabelProps, PopoverLabelElementProps>,
) => {
  return (
    <Dialog.Label<
      Component<Omit<PopoverLabelElementProps, keyof DialogLabelElementProps>>
    >
      as={DEFAULT_POPOVER_LABEL_ELEMENT}
      // === ElementProps ===
      data-corvu-popover-label=""
      // === Misc ===
      data-corvu-dialog-label={null}
      {...(props as PopoverLabelProps)}
    />
  )
}

export default PopoverLabel
