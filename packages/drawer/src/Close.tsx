import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type CloseCorvuProps as DialogCloseCorvuProps,
  type CloseElementProps as DialogCloseElementProps,
  type CloseSharedElementProps as DialogCloseSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type DrawerCloseCorvuProps = DialogCloseCorvuProps

export type DrawerCloseSharedElementProps<T extends ValidComponent = 'button'> =
  DialogCloseSharedElementProps<T>

export type DrawerCloseElementProps = DrawerCloseSharedElementProps & {
  'data-corvu-drawer-close': ''
} & DialogCloseElementProps

export type DrawerCloseProps<T extends ValidComponent = 'button'> =
  DrawerCloseCorvuProps & Partial<DrawerCloseSharedElementProps<T>>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-drawer-close` - Present on every drawer close element.
 */
const DrawerClose = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, DrawerCloseProps<T>>,
) => {
  return (
    <Dialog.Close<
      Component<Omit<DrawerCloseElementProps, keyof DialogCloseElementProps>>
    >
      // === ElementProps ===
      data-corvu-drawer-close=""
      // === Misc ===
      data-corvu-dialog-close={null}
      {...(props as DrawerCloseProps)}
    />
  )
}

export default DrawerClose
