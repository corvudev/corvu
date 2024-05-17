import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type DescriptionCorvuProps as DialogDescriptionCorvuProps,
  type DescriptionElementProps as DialogDescriptionElementProps,
  type DescriptionSharedElementProps as DialogDescriptionSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type DrawerDescriptionCorvuProps = DialogDescriptionCorvuProps

export type DrawerDescriptionSharedElementProps<
  T extends ValidComponent = 'p',
> = DialogDescriptionSharedElementProps<T>

export type DrawerDescriptionElementProps =
  DrawerDescriptionSharedElementProps & {
    'data-corvu-drawer-description': ''
  } & DialogDescriptionElementProps

export type DrawerDescriptionProps<T extends ValidComponent = 'p'> =
  DrawerDescriptionCorvuProps & Partial<DrawerDescriptionSharedElementProps<T>>

/** Description element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-description` - Present on every drawer description element.
 */
const DrawerDescription = <T extends ValidComponent = 'p'>(
  props: DynamicProps<T, DrawerDescriptionProps<T>>,
) => {
  return (
    <Dialog.Description<
      Component<
        Omit<DrawerDescriptionElementProps, keyof DialogDescriptionElementProps>
      >
    >
      // === ElementProps ===
      data-corvu-drawer-description=""
      // === Misc ===
      data-corvu-dialog-description={null}
      {...(props as DrawerDescriptionProps)}
    />
  )
}

export default DrawerDescription
