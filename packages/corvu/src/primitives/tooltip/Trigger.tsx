import { callEventHandler, dataIf, mergeRefs } from '@lib/utils'
import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import DynamicButton from '@lib/components/DynamicButton'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalTooltipContext } from '@primitives/tooltip/context'

const DEFAULT_TOOLTIP_TRIGGER_ELEMENT: ValidComponent = 'button'

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
    /** @hidden */
    onPointerDown?: JSX.EventHandlerUnion<HTMLElement, PointerEvent>
    /** @hidden */
    onFocus?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
    /** @hidden */
    onBlur?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
  }
>

/** Button that opens the tooltip when focused or hovered.
 *
 * @data `data-corvu-tooltip-trigger` - Present on every tooltip trigger element.
 * @data `data-open` - Present when the tooltip is open.
 * @data `data-closed` - Present when the tooltip is closed.
 */
const TooltipTrigger = <
  T extends ValidComponent = typeof DEFAULT_TOOLTIP_TRIGGER_ELEMENT,
>(
  props: TooltipTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'ref',
    'onPointerDown',
    'onFocus',
    'onBlur',
  ])

  const context = createMemo(() =>
    useInternalTooltipContext(localProps.contextId),
  )

  let pointerIsDown = false

  const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
    event,
  ) => {
    pointerIsDown = true
    document.addEventListener('pointerup', () => (pointerIsDown = false), {
      once: true,
    })
    if (
      callEventHandler(localProps.onPointerDown, event) ||
      !context().closeOnPointerDown() ||
      callEventHandler(context().onPointerDown, event)
    )
      return
    context().setOpen(false)
  }

  const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (event) => {
    if (
      callEventHandler(localProps.onFocus, event) ||
      pointerIsDown ||
      !context().openOnFocus() ||
      callEventHandler(context().onFocus, event)
    )
      return
    context().setTooltipState('focused')
    context().setOpen(true)
  }

  const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (event) => {
    if (
      callEventHandler(localProps.onBlur, event) ||
      !context().openOnFocus() ||
      callEventHandler(context().onBlur, event)
    )
      return
    if (context().tooltipState() !== 'focused') return
    context().setTooltipState('none')
    context().setOpen(false)
  }

  return (
    <DynamicButton
      ref={mergeRefs(context().setTriggerRef, localProps.ref)}
      as={localProps.as ?? DEFAULT_TOOLTIP_TRIGGER_ELEMENT}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      aria-expanded={context().open() ? 'true' : 'false'}
      aria-describedby={context().tooltipId()}
      data-open={dataIf(context().open())}
      data-closed={dataIf(!context().open())}
      data-corvu-tooltip-trigger=""
      {...otherProps}
    />
  )
}

export default TooltipTrigger
