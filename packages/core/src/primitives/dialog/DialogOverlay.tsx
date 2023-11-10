import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { some, mergeRefs, dataIf } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_OVERLAY_ELEMENT = 'div'

export type DialogOverlayProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    ref?: (element: HTMLElement) => void
    /** Whether the dialog portal should be forced to render. Useful for custom transition and animations. */
    forceMount?: boolean
  }
>

const DialogOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  const { open, overlayPresent, setOverlayRef } = useDialogContext()

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
