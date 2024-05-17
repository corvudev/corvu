import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type LabelCorvuProps as DialogLabelCorvuProps,
  type LabelElementProps as DialogLabelElementProps,
  type LabelSharedElementProps as DialogLabelSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type DrawerLabelCorvuProps = DialogLabelCorvuProps

export type DrawerLabelSharedElementProps<T extends ValidComponent = 'h2'> =
  DialogLabelSharedElementProps<T>

export type DrawerLabelElementProps = DrawerLabelSharedElementProps & {
  'data-corvu-drawer-label': ''
} & DialogLabelElementProps

export type DrawerLabelProps<T extends ValidComponent = 'h2'> =
  DrawerLabelCorvuProps & Partial<DrawerLabelSharedElementProps<T>>

/** Label element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-label` - Present on every drawer label element.
 */
const DrawerLabel = <T extends ValidComponent = 'h2'>(
  props: DynamicProps<T, DrawerLabelProps<T>>,
) => {
  return (
    <Dialog.Label<
      Component<Omit<DrawerLabelElementProps, keyof DialogLabelElementProps>>
    >
      // === ElementProps ===
      data-corvu-drawer-label=""
      // === Misc ===
      data-corvu-dialog-label={null}
      {...(props as DrawerLabelProps)}
    />
  )
}

export default DrawerLabel
