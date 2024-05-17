import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type CloseCorvuProps as DialogCloseCorvuProps,
  type CloseElementProps as DialogCloseElementProps,
  type CloseSharedElementProps as DialogCloseSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type PopoverCloseCorvuProps = DialogCloseCorvuProps

export type PopoverCloseSharedElementProps<
  T extends ValidComponent = 'button',
> = DialogCloseSharedElementProps<T>

export type PopoverCloseElementProps = PopoverCloseSharedElementProps & {
  'data-corvu-popover-close': ''
} & DialogCloseElementProps

export type PopoverCloseProps<T extends ValidComponent = 'button'> =
  PopoverCloseCorvuProps & Partial<PopoverCloseSharedElementProps<T>>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-popover-close` - Present on every popover close element.
 */
const PopoverClose = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, PopoverCloseProps<T>>,
) => {
  return (
    <Dialog.Close<
      Component<Omit<PopoverCloseElementProps, keyof DialogCloseElementProps>>
    >
      // === ElementProps ===
      data-corvu-popover-close=""
      // === Misc ===
      data-corvu-dialog-close={null}
      {...(props as PopoverCloseProps)}
    />
  )
}

export default PopoverClose
