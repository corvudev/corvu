import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type DescriptionCorvuProps as DialogDescriptionCorvuProps,
  type DescriptionElementProps as DialogDescriptionElementProps,
  type DescriptionSharedElementProps as DialogDescriptionSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_DRAWER_DESCRIPTION_ELEMENT = 'p'

export type DrawerDescriptionCorvuProps = DialogDescriptionCorvuProps

export type DrawerDescriptionSharedElementProps =
  DialogDescriptionSharedElementProps

export type DrawerDescriptionElementProps =
  DrawerDescriptionSharedElementProps & {
    'data-corvu-drawer-description': ''
  } & DialogDescriptionElementProps

export type DrawerDescriptionProps = DrawerDescriptionCorvuProps &
  Partial<DrawerDescriptionSharedElementProps>

/** Description element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-description` - Present on every drawer description element.
 */
const DrawerDescription = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_DESCRIPTION_ELEMENT,
>(
  props: DynamicProps<T, DrawerDescriptionProps, DrawerDescriptionElementProps>,
) => {
  return (
    <Dialog.Description<
      Component<
        Omit<DrawerDescriptionElementProps, keyof DialogDescriptionElementProps>
      >
    >
      as={DEFAULT_DRAWER_DESCRIPTION_ELEMENT}
      // === ElementProps ===
      data-corvu-drawer-description=""
      // === Misc ===
      data-corvu-dialog-description={null}
      {...(props as DrawerDescriptionProps)}
    />
  )
}

export default DrawerDescription
