import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs, some } from '@corvu/utils/reactivity'
import { dataIf } from '@corvu/utils'
import Dismissible from '@corvu/utils/components/Dismissible'
import { getFloatingStyle } from '@corvu/utils/floating'
import type { Placement } from '@floating-ui/dom'
import type { Ref } from '@corvu/utils/dom'
import { useInternalTooltipContext } from '@src/context'

export const DEFAULT_TOOLTIP_CONTENT_ELEMENT = 'div'

export type TooltipContentCorvuProps = {
  /**
   * Whether the tooltip content should be forced to render. Useful when using third-party animation libraries.
   * @defaultValue `false`
   */
  forceMount?: boolean
  /**
   * The `id` of the tooltip context to use.
   */
  contextId?: string
}

export type TooltipContentSharedElementProps = {
  ref: Ref
  style: JSX.CSSProperties
}

export type TooltipContentElementProps = TooltipContentSharedElementProps & {
  id: string
  role: 'tooltip'
  'data-closed': '' | undefined
  'data-open': '' | undefined
  'data-placement': Placement
  'data-corvu-tooltip-content': ''
}

export type TooltipContentProps = TooltipContentCorvuProps &
  Partial<TooltipContentSharedElementProps>

/** Content of the tooltip. Can be animated.
 *
 * @data `data-corvu-tooltip-content` - Present on every tooltip content element.
 * @data `data-open` - Present when the tooltip is open.
 * @data `data-closed` - Present when the tooltip is closed.
 * @data `data-placement` - Current placement of the tooltip.
 */
const TooltipContent = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_CONTENT_ELEMENT,
>(
  props: DynamicProps<T, TooltipContentProps, TooltipContentElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as TooltipContentProps, [
    'forceMount',
    'contextId',
    'ref',
    'style',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  const show = () =>
    some(context().open, () => localProps.forceMount, context().contentPresent)

  return (
    <Dismissible
      element={context().contentRef}
      enabled={context().open() || context().contentPresent()}
      onDismiss={() => context().setOpen(false)}
      dismissOnEscapeKeyDown={context().closeOnEscapeKeyDown}
      dismissOnOutsidePointer={false}
      noOutsidePointerEvents={false}
      onEscapeKeyDown={context().onEscapeKeyDown}
    >
      {(props) => (
        <Show when={show()}>
          <Dynamic<TooltipContentElementProps>
            as={DEFAULT_TOOLTIP_CONTENT_ELEMENT}
            // === SharedElementProps ===
            ref={mergeRefs(context().setContentRef, localProps.ref)}
            style={{
              ...getFloatingStyle({
                strategy: () => context().strategy(),
                floatingState: () => context().floatingState(),
              })(),
              'pointer-events': props.isLastLayer ? 'auto' : undefined,
              ...localProps.style,
            }}
            // === ElementProps ===
            id={context().tooltipId()}
            role="tooltip"
            data-closed={dataIf(!context().open())}
            data-open={dataIf(context().open())}
            data-placement={context().floatingState().placement}
            data-corvu-tooltip-content=""
            {...otherProps}
          />
        </Show>
      )}
    </Dismissible>
  )
}

export default TooltipContent
