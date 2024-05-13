import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type DescriptionCorvuProps as DialogDescriptionCorvuProps,
  type DescriptionElementProps as DialogDescriptionElementProps,
  type DescriptionSharedElementProps as DialogDescriptionSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_POPOVER_DESCRIPTION_ELEMENT = 'p'

export type PopoverDescriptionCorvuProps = DialogDescriptionCorvuProps

export type PopoverDescriptionSharedElementProps =
  DialogDescriptionSharedElementProps

export type PopoverDescriptionElementProps =
  PopoverDescriptionSharedElementProps & {
    'data-corvu-popover-description': ''
  } & DialogDescriptionElementProps

export type PopoverDescriptionProps = PopoverDescriptionCorvuProps &
  Partial<PopoverDescriptionSharedElementProps>

/** Description element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-description` - Present on every popover description element.
 */
const PopoverDescription = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_DESCRIPTION_ELEMENT,
>(
  props: DynamicProps<
    T,
    PopoverDescriptionProps,
    PopoverDescriptionElementProps
  >,
) => {
  return (
    <Dialog.Description<
      Component<
        Omit<
          PopoverDescriptionElementProps,
          keyof DialogDescriptionElementProps
        >
      >
    >
      as={DEFAULT_POPOVER_DESCRIPTION_ELEMENT}
      // === ElementProps ===
      data-corvu-popover-description=""
      // === Misc ===
      data-corvu-dialog-description={null}
      {...(props as PopoverDescriptionProps)}
    />
  )
}

export default PopoverDescription
