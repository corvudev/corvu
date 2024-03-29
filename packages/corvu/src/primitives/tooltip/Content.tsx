import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { dataIf, getFloatingStyle, mergeRefs, some } from '@lib/utils'
import Dynamic, { type DynamicAttributes } from '@lib/components/Dynamic'
import Dismissible from '@lib/components/Dismissible'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

export const DEFAULT_TOOLTIP_CONTENT_ELEMENT = 'div'

export type TooltipContentProps<
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_CONTENT_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * Whether the tooltip content should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the tooltip context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

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
  props: TooltipContentProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'forceMount',
    'contextId',
    'ref',
    'style',
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
          <Dynamic
            as={
              (localProps.as as ValidComponent | undefined) ??
              DEFAULT_TOOLTIP_CONTENT_ELEMENT
            }
            ref={mergeRefs(context().setContentRef, localProps.ref)}
            role="tooltip"
            id={context().tooltipId()}
            data-open={dataIf(context().open())}
            data-closed={dataIf(!context().open())}
            data-placement={context().floatingState().placement}
            data-corvu-tooltip-content=""
            style={{
              ...getFloatingStyle({
                strategy: () => context().strategy(),
                floatingState: () => context().floatingState(),
              })(),
              'pointer-events': props.isLastLayer ? 'auto' : undefined,
              ...localProps.style,
            }}
            {...otherProps}
          />
        </Show>
      )}
    </Dismissible>
  )
}

export default TooltipContent
