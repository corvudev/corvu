import type {
  CloseProps as DialogCloseProps,
  DescriptionProps as DialogDescriptionProps,
  LabelProps as DialogLabelProps,
  TriggerProps as DialogTriggerProps,
} from '@corvu/dialog'
import Dialog from '@corvu/dialog'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DRAWER_CLOSE_ELEMENT = 'button'
const DEFAULT_DRAWER_DESCRIPTION_ELEMENT = 'p'
const DEFAULT_DRAWER_LABEL_ELEMENT = 'h2'
const DEFAULT_DRAWER_TRIGGER_ELEMENT = 'button'

/** Close button that changes the open state to false when clicked.
 *
 * @data `data-corvu-drawer-close` - Present on every drawer close element.
 */
const DrawerClose = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_CLOSE_ELEMENT,
>(
  props: DialogCloseProps<T>,
) => {
  return (
    <Dialog.Close
      data-corvu-dialog-close={undefined}
      data-corvu-drawer-close=""
      {...props}
    />
  )
}

/** Description element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-description` - Present on every drawer description element.
 */
const DrawerDescription = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  return (
    <Dialog.Description
      data-corvu-dialog-description={undefined}
      data-corvu-drawer-description=""
      {...props}
    />
  )
}

/** Label element to announce the drawer to accessibility tools.
 *
 * @data `data-corvu-drawer-label` - Present on every drawer label element.
 */
const DrawerLabel = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_LABEL_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  return (
    <Dialog.Label
      data-corvu-dialog-label={undefined}
      data-corvu-drawer-label=""
      {...props}
    />
  )
}

/** Button that changes the open state of the drawer when clicked.
 *
 * @data `data-corvu-drawer-trigger` - Present on every drawer trigger element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 */
const DrawerTrigger = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_TRIGGER_ELEMENT,
>(
  props: DialogTriggerProps<T>,
) => {
  return (
    <Dialog.Trigger
      data-corvu-dialog-trigger={undefined}
      data-corvu-drawer-trigger=""
      {...props}
    />
  )
}

export { DrawerClose, DrawerDescription, DrawerLabel, DrawerTrigger }
