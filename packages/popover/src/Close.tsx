import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type CloseCorvuProps as DialogCloseCorvuProps,
  type CloseElementProps as DialogCloseElementProps,
  type CloseSharedElementProps as DialogCloseSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_POPOVER_CLOSE_ELEMENT = 'button'

export type PopoverCloseCorvuProps = DialogCloseCorvuProps

export type PopoverCloseSharedElementProps = DialogCloseSharedElementProps

export type PopoverCloseElementProps = PopoverCloseSharedElementProps & {
  'data-corvu-popover-close': ''
} & DialogCloseElementProps

export type PopoverCloseProps = PopoverCloseCorvuProps &
  Partial<PopoverCloseSharedElementProps>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-popover-close` - Present on every popover close element.
 */
const PopoverClose = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_CLOSE_ELEMENT,
>(
  props: DynamicProps<T, PopoverCloseProps, PopoverCloseElementProps>,
) => {
  return (
    <Dialog.Close<
      Component<Omit<PopoverCloseElementProps, keyof DialogCloseElementProps>>
    >
      as={DEFAULT_POPOVER_CLOSE_ELEMENT}
      // === ElementProps ===
      data-corvu-popover-close=""
      // === Misc ===
      data-corvu-dialog-close={null}
      {...(props as PopoverCloseProps)}
    />
  )
}

export default PopoverClose
