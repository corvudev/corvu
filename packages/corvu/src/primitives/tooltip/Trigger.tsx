import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import { dataIf, mergeRefs } from '@lib/utils'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import DynamicButton from '@lib/components/DynamicButton'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

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
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      as={localProps.as ?? (DEFAULT_TOOLTIP_TRIGGER_ELEMENT as ValidComponent)}
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
