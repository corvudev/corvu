import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { some, mergeRefs, dataIf } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_OVERLAY_ELEMENT = 'div'

export type DialogOverlayProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** Whether the dialog overlay should be forced to render. Useful when using third-party animation libraries. */
    forceMount?: boolean
    /** @hidden */
    ref?: (element: HTMLElement) => void
  }
>

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-dialog-overlay` - Present on every dialog overlay element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  const { open, overlayPresent, setOverlayRef } = useInternalDialogContext()

  const [localProps, otherProps] = splitProps(props, [
    'as',
    'ref',
    'forceMount',
  ])

  return (
    <Show when={some(open, () => localProps.forceMount, overlayPresent)}>
      <Polymorphic
        as={localProps.as ?? (DEFAULT_DIALOG_OVERLAY_ELEMENT as ValidComponent)}
        ref={mergeRefs(setOverlayRef, localProps.ref)}
        aria-hidden="true"
        data-open={dataIf(open())}
        data-closed={dataIf(!open())}
        data-corvu-dialog-overlay
        tabIndex="-1"
        {...otherProps}
      />
    </Show>
  )
}

export default DialogOverlay
