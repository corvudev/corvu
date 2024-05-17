import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type DescriptionCorvuProps as DialogDescriptionCorvuProps,
  type DescriptionElementProps as DialogDescriptionElementProps,
  type DescriptionSharedElementProps as DialogDescriptionSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type PopoverDescriptionCorvuProps = DialogDescriptionCorvuProps

export type PopoverDescriptionSharedElementProps<
  T extends ValidComponent = 'p',
> = DialogDescriptionSharedElementProps<T>

export type PopoverDescriptionElementProps =
  PopoverDescriptionSharedElementProps & {
    'data-corvu-popover-description': ''
  } & DialogDescriptionElementProps

export type PopoverDescriptionProps<T extends ValidComponent = 'p'> =
  PopoverDescriptionCorvuProps &
    Partial<PopoverDescriptionSharedElementProps<T>>

/** Description element to announce the popover to accessibility tools.
 *
 * @data `data-corvu-popover-description` - Present on every popover description element.
 */
const PopoverDescription = <T extends ValidComponent = 'p'>(
  props: DynamicProps<T, PopoverDescriptionProps<T>>,
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
      // === ElementProps ===
      data-corvu-popover-description=""
      // === Misc ===
      data-corvu-dialog-description={null}
      {...(props as PopoverDescriptionProps)}
    />
  )
}

export default PopoverDescription
