import { OverrideComponentProps } from '@lib/types'
import { some } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'

export type DialogPortalProps = OverrideComponentProps<
  typeof Portal,
  {
    /** Whether the dialog portal should be forced to render. Useful for custom transition and animations. */
    forceMount?: boolean
  }
>

const DialogPortal = (props: DialogPortalProps) => {
  const { open, contentPresent, overlayPresent } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['forceMount'])

  return (
    <Show
      when={some(
        open,
        () => localProps.forceMount,
        contentPresent,
        overlayPresent,
      )}
    >
      <Portal {...otherProps} />
    </Show>
  )
}

export default DialogPortal
