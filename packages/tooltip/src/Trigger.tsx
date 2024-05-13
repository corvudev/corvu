import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import {
  type DynamicAttributes,
  DynamicButton,
  type OverrideComponentProps,
} from '@corvu/utils/dynamic'
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalTooltipContext } from '@src/context'

const DEFAULT_TOOLTIP_TRIGGER_ELEMENT = 'button'

export type TooltipTriggerProps<
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the tooltip context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
  }
>

/** Button that opens the tooltip when focused or hovered.
 *
 * @data `data-corvu-tooltip-trigger` - Present on every tooltip trigger element.
 * @data `data-open` - Present when the tooltip is open.
 * @data `data-closed` - Present when the tooltip is closed.
 * @data `data-placement` - Current placement of the tooltip. Only present when the tooltip is open.
 */
const TooltipTrigger = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_TRIGGER_ELEMENT,
>(
  props: TooltipTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['as', 'contextId', 'ref'])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <DynamicButton
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_TOOLTIP_TRIGGER_ELEMENT
      }
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      aria-expanded={context().open() ? 'true' : 'false'}
      aria-describedby={context().open() ? context().tooltipId() : undefined}
      data-open={dataIf(context().open())}
      data-closed={dataIf(!context().open())}
      data-placement={
        context().open() ? context().floatingState().placement : undefined
      }
      data-corvu-tooltip-trigger=""
      {...otherProps}
    />
  )
}

export default TooltipTrigger
