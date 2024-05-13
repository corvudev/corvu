import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type CloseCorvuProps as DialogCloseCorvuProps,
  type CloseElementProps as DialogCloseElementProps,
  type CloseSharedElementProps as DialogCloseSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_DRAWER_CLOSE_ELEMENT = 'button'

export type DrawerCloseCorvuProps = DialogCloseCorvuProps

export type DrawerCloseSharedElementProps = DialogCloseSharedElementProps

export type DrawerCloseElementProps = DrawerCloseSharedElementProps & {
  'data-corvu-drawer-close': ''
} & DialogCloseElementProps

export type DrawerCloseProps = DrawerCloseCorvuProps &
  Partial<DrawerCloseSharedElementProps>

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-drawer-close` - Present on every drawer close element.
 */
const DrawerClose = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_CLOSE_ELEMENT,
>(
  props: DynamicProps<T, DrawerCloseProps, DrawerCloseElementProps>,
) => {
  return (
    <Dialog.Close<
      Component<Omit<DrawerCloseElementProps, keyof DialogCloseElementProps>>
    >
      as={DEFAULT_DRAWER_CLOSE_ELEMENT}
      // === ElementProps ===
      data-corvu-drawer-close=""
      // === Misc ===
      data-corvu-dialog-close={null}
      {...(props as DrawerCloseProps)}
    />
  )
}

export default DrawerClose
