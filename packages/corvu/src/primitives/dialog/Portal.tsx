import { OverrideComponentProps } from '@lib/types'
import { some } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/Context'
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

  const keepAlive = createMemo((prev) => {
    if (prev) return prev
    return show()
  }, false)

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
