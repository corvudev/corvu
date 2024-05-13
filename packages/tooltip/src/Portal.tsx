import { createMemo, Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@corvu/utils/dynamic'
import { Portal } from 'solid-js/web'
import { some } from '@corvu/utils/reactivity'
import { useInternalTooltipContext } from '@src/context'

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

  return (
    <Show when={show()}>
      <Portal {...otherProps} />
    </Show>
  )
}

export default TooltipPortal
