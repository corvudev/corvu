import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  DynamicButton,
  type DynamicButtonElementProps,
  type DynamicButtonSharedElementProps,
  type DynamicProps,
} from '@corvu/utils/dynamic'
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import type { Placement } from '@floating-ui/dom'
import { useInternalTooltipContext } from '@src/context'

export type TooltipTriggerCorvuProps = {
  /**
   * The `id` of the tooltip context to use.
   */
  contextId?: string
}

export type TooltipTriggerSharedElementProps<
  T extends ValidComponent = 'button',
> = DynamicButtonSharedElementProps<T>

export type TooltipTriggerElementProps = TooltipTriggerSharedElementProps & {
  'aria-describedby': string | undefined
  'aria-expanded': 'true' | 'false'
  'data-closed': '' | undefined
  'data-open': '' | undefined
  'data-placement': Placement | undefined
  'data-corvu-tooltip-trigger': ''
} & DynamicButtonElementProps

export type TooltipTriggerProps<T extends ValidComponent = 'button'> =
  TooltipTriggerCorvuProps & Partial<TooltipTriggerSharedElementProps<T>>

/** Button that opens the tooltip when focused or hovered.
 *
 * @data `data-corvu-tooltip-trigger` - Present on every tooltip trigger element.
 * @data `data-open` - Present when the tooltip is open.
 * @data `data-closed` - Present when the tooltip is closed.
 * @data `data-placement` - Current placement of the tooltip. Only present when the tooltip is open.
 */
const TooltipTrigger = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, TooltipTriggerProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as TooltipTriggerProps, [
    'contextId',
    'ref',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  return (
    <DynamicButton<
      Component<
        Omit<TooltipTriggerElementProps, keyof DynamicButtonElementProps>
      >
    >
      // === SharedElementProps ===
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      // === ElementProps ===
      aria-describedby={context().open() ? context().tooltipId() : undefined}
      aria-expanded={context().open() ? 'true' : 'false'}
      data-closed={dataIf(!context().open())}
      data-open={dataIf(context().open())}
      data-placement={
        context().open() ? context().floatingState().placement : undefined
      }
      data-corvu-tooltip-trigger=""
      {...otherProps}
    />
  )
}

export default TooltipTrigger
