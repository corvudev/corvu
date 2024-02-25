import { createMemo, Show, splitProps } from 'solid-js'
import createIsClient from '@lib/create/isClient'
import type { OverrideComponentProps } from '@lib/types'
import { Portal } from 'solid-js/web'
import { some } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/context'

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
    'children',
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

  const isClient = createIsClient()
  const keepAlive = createMemo((prev) => prev || (show() && isClient()), false)

  return (
    <Show when={keepAlive()}>
      {(() => {
        const memoizedChildren = createMemo(() => localProps.children)

        return (
          <Show when={show()}>
            <Portal {...otherProps}>{memoizedChildren()}</Portal>
          </Show>
        )
      })()}
    </Show>
  )
}

export default DialogPortal
