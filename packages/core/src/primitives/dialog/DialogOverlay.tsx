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
  }
>

const DialogOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  const { open, forceMount, overlayPresent, setOverlayRef } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as', 'ref'])

  return (
    <Show when={some(open, forceMount, overlayPresent)}>
      <Polymorphic
        as={localProps.as ?? (DEFAULT_DIALOG_OVERLAY_ELEMENT as ValidComponent)}
        ref={mergeRefs(setOverlayRef, localProps.ref)}
        aria-hidden="true"
        data-open={dataIf(open())}
        data-closed={dataIf(!open())}
        tabIndex="-1"
        {...otherProps}
      />
    </Show>
  )
}

export default DialogOverlay
