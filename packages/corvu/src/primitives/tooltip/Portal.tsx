import { createMemo, Show, splitProps } from 'solid-js'
import createIsClient from '@lib/create/isClient'
import type { OverrideComponentProps } from '@lib/types'
import { Portal } from 'solid-js/web'
import { some } from '@lib/utils'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

export type TooltipPortalProps = OverrideComponentProps<
  typeof Portal,
  {
    /**
     * Whether the tooltip portal should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the tooltip context to use.
     */
    contextId?: string
  }
>

/** Portals its children at the end of the body element to ensure that the tooltip always rendered on top. */
const TooltipPortal = (props: TooltipPortalProps) => {
  const [localProps, otherProps] = splitProps(props, [
    'forceMount',
    'contextId',
    'children',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  const show = () =>
    some(
      context().open,
      // eslint-disable-next-line solid/reactivity
      () => localProps.forceMount,
      context().contentPresent,
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

export default TooltipPortal
