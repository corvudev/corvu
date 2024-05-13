import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type LabelCorvuProps as DialogLabelCorvuProps,
  type LabelElementProps as DialogLabelElementProps,
  type LabelSharedElementProps as DialogLabelSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

const DEFAULT_DRAWER_LABEL_ELEMENT = 'h2'

export type DrawerLabelCorvuProps = DialogLabelCorvuProps

export type DrawerLabelSharedElementProps = DialogLabelSharedElementProps

export type DrawerLabelElementProps = DrawerLabelSharedElementProps & {
  'data-corvu-drawer-label': ''
} & DialogLabelElementProps

export type DrawerLabelProps = DrawerLabelCorvuProps &
  Partial<DrawerLabelSharedElementProps>

/** Label element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-label` - Present on every drawer label element.
 */
const DrawerLabel = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_LABEL_ELEMENT,
>(
  props: DynamicProps<T, DrawerLabelProps, DrawerLabelElementProps>,
) => {
  return (
    <Dialog.Label<
      Component<Omit<DrawerLabelElementProps, keyof DialogLabelElementProps>>
    >
      as={DEFAULT_DRAWER_LABEL_ELEMENT}
      // === ElementProps ===
      data-corvu-drawer-label=""
      // === Misc ===
      data-corvu-dialog-label={null}
      {...(props as DrawerLabelProps)}
    />
  )
}

export default DrawerLabel
