import type { Component, ValidComponent } from 'solid-js'
import Dialog, {
  type TriggerCorvuProps as DialogTriggerCorvuProps,
  type TriggerElementProps as DialogTriggerElementProps,
  type TriggerSharedElementProps as DialogTriggerSharedElementProps,
} from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type DrawerTriggerCorvuProps = DialogTriggerCorvuProps

export type DrawerTriggerSharedElementProps<
  T extends ValidComponent = 'button',
> = DialogTriggerSharedElementProps<T>

export type DrawerTriggerElementProps = DrawerTriggerSharedElementProps & {
  'data-corvu-drawer-trigger': ''
} & DialogTriggerElementProps

export type DrawerTriggerProps<T extends ValidComponent = 'button'> =
  DrawerTriggerCorvuProps & Partial<DrawerTriggerSharedElementProps<T>>

/** Button that changes the open state of the drawer when clicked.
 *
 * @data `data-corvu-drawer-trigger` - Present on every drawer trigger element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 */
const DrawerTrigger = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, DrawerTriggerProps<T>>,
) => {
  return (
    <Dialog.Trigger<
      Component<
        Omit<DrawerTriggerElementProps, keyof DialogTriggerElementProps>
      >
    >
      // === ElementProps ===
      data-corvu-drawer-trigger=""
      // === Misc ===
      data-corvu-dialog-trigger={null}
      {...(props as DrawerTriggerProps)}
    />
  )
}

export default DrawerTrigger
