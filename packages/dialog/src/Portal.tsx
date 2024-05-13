import { createMemo, Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@corvu/utils/dynamic'
import { Portal } from 'solid-js/web'
import { some } from '@corvu/utils/reactivity'
import { useInternalDialogContext } from '@src/context'

export type DialogPortalProps = OverrideComponentProps<
  typeof Portal,
  {
    /**
     * Whether the dialog portal should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the dialog context to use.
     */
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

  const show = () =>
    some(
      context().open,
      // eslint-disable-next-line solid/reactivity
      () => localProps.forceMount,
      context().contentPresent,
      context().overlayPresent,
    )

  return (
    <Show when={show()}>
      <Portal {...otherProps} />
    </Show>
  )
}

export default DialogPortal
