import { OverrideComponentProps } from '@lib/types'
import { some } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'

export type DialogPortalProps = OverrideComponentProps<
  typeof Portal,
  {
    /** Whether the dialog portal should be forced to render. Useful when using third-party animation libraries. */
    forceMount?: boolean
  }
>

/** Portals its children at the end of the body element to ensure that the dialog always rendered on top. */
const DialogPortal = (props: DialogPortalProps) => {
  const { open, contentPresent, overlayPresent } = useInternalDialogContext()

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
