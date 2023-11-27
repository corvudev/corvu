import { OverrideComponentProps } from '@lib/types'
import { some } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { Show, createMemo, splitProps } from 'solid-js'
import { Portal } from 'solid-js/web'

export type DialogPortalProps = OverrideComponentProps<
  typeof Portal,
  {
    /** Whether the dialog portal should be forced to render. Useful when using third-party animation libraries. */
    forceMount?: boolean
    /** The `id` of the dialog context to use. */
    contextId?: string
  }
>

/** Portals its children at the end of the body element to ensure that the dialog always rendered on top. */
const DialogPortal = (props: DialogPortalProps) => {
  const [localProps, otherProps] = splitProps(props, [
    'forceMount',
    'contextId',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  return (
    <Show
      when={some(
        context().open,
        () => localProps.forceMount,
        context().contentPresent,
        context().overlayPresent,
      )}
    >
      <Portal {...otherProps} />
    </Show>
  )
}

export default DialogPortal
