import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import Dialog, {
  type OverlayCorvuProps as DialogOverlayCorvuProps,
  type OverlayElementProps as DialogOverlayElementProps,
  type OverlaySharedElementProps as DialogOverlaySharedElementProps,
} from '@corvu/dialog'
import { dataIf } from '@corvu/utils'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { useInternalDrawerContext } from '@src/context'

const DEFAULT_DRAWER_OVERLAY_ELEMENT = 'div'

export type DrawerOverlayCorvuProps = DialogOverlayCorvuProps

export type DrawerOverlaySharedElementProps = DialogOverlaySharedElementProps

export type DrawerOverlayElementProps = DrawerOverlaySharedElementProps & {
  'data-closing': '' | undefined
  'data-opening': '' | undefined
  'data-resizing': '' | undefined
  'data-snapping': '' | undefined
  'data-transitioning': '' | undefined
  'data-corvu-drawer-overlay': ''
} & DialogOverlayElementProps

export type DrawerOverlayProps = DrawerOverlayCorvuProps &
  Partial<DrawerOverlaySharedElementProps>

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
  props: DynamicProps<T, DrawerOverlayProps, DrawerOverlayElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DrawerOverlayProps, [
    'contextId',
  ])

  const drawerContext = createMemo(() =>
    useInternalDrawerContext(localProps.contextId),
  )

  return (
    <Dialog.Overlay<
      Component<
        Omit<DrawerOverlayElementProps, keyof DialogOverlayElementProps>
      >
    >
      as={DEFAULT_DRAWER_OVERLAY_ELEMENT}
      contextId={localProps.contextId}
      // === ElementProps ===
      data-closing={dataIf(drawerContext().transitionState() === 'closing')}
      data-opening={dataIf(drawerContext().transitionState() === 'opening')}
      data-resizing={dataIf(drawerContext().transitionState() === 'resizing')}
      data-snapping={dataIf(drawerContext().transitionState() === 'snapping')}
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      data-corvu-drawer-overlay=""
      // === Misc ===
      data-corvu-dialog-overlay={null}
      {...otherProps}
    />
  )
}

export default DrawerOverlay
