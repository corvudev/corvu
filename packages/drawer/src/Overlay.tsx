import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { dataIf } from '@corvu/utils'
import Dialog from '@corvu/dialog'
import type { OverlayProps as DialogOverlayProps } from '@corvu/dialog'
import { useInternalDrawerContext } from '@src/context'

const DEFAULT_DRAWER_OVERLAY_ELEMENT = 'div'

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-drawer-overlay` - Present on every drawer overlay element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 * @data `data-transitioning` - Present when the drawer is transitioning (opening, closing or snapping).
 * @data `data-opening` - Present when the drawer is in the open transition.
 * @data `data-closing` - Present when the drawer is in the close transition.
 * @data `data-snapping` - Present when the drawer is transitioning after the user stops dragging.
 * @data `data-resizing` - Present when the drawer is transitioning after the size (width/height) changes. Only present if `transitionResize` is set to `true`.
 */
const DrawerOverlay = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId'])

  const drawerContext = createMemo(() =>
    useInternalDrawerContext(localProps.contextId),
  )

  return (
    <Dialog.Overlay
      contextId={localProps.contextId}
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      data-opening={dataIf(drawerContext().transitionState() === 'opening')}
      data-closing={dataIf(drawerContext().transitionState() === 'closing')}
      data-snapping={dataIf(drawerContext().transitionState() === 'snapping')}
      data-resizing={dataIf(drawerContext().transitionState() === 'resizing')}
      data-corvu-dialog-overlay={undefined}
      data-corvu-drawer-overlay=""
      {...(otherProps as DialogOverlayProps<T>)}
    />
  )
}

export default DrawerOverlay
