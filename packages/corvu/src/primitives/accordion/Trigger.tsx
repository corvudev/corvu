import { callEventHandler, dataIf } from '@lib/utils'
import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import DisclosureTrigger, {
  DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
  type DisclosureTriggerProps,
} from '@primitives/disclosure/Trigger'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalAccordionContext } from '@primitives/accordion/context'
import { useInternalAccordionItemContext } from '@primitives/accordion/itemContext'

export type AccordionTriggerProps<
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the accordion context to use.
     */
    contextId?: string
    /** @hidden */
    onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
  }
>

/** Button that changes the open state of the accordion item when clicked.
 *
 * @data `data-corvu-accordion-trigger` - Present on every accordion trigger element.
 * @data `data-expanded` - Present when the accordion is expanded.
 * @data `data-collapsed` - Present when the accordion is collapsed.
 * @data `data-disabled` - Present when the accordion trigger is disabled.
 */
const AccordionTrigger = <
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
>(
  props: AccordionTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId', 'onKeyDown'])
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | null>(null)

  const accordionContext = createMemo(() =>
    useInternalAccordionContext(localProps.contextId),
  )

  createEffect(() => {
    const trigger = triggerRef()
    const context = accordionContext()
    if (trigger) {
      context.registerTrigger(trigger)
      onCleanup(() => context.unregisterTrigger(trigger))
    }
  })

  const context = createMemo(() =>
    useInternalAccordionItemContext(localProps.contextId),
  )

  createEffect(() => {
    const _context = context()
    _context.registerTriggerId()
    onCleanup(() => _context.unregisterTriggerId())
  })

  const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
    !callEventHandler(localProps.onKeyDown, e) &&
      accordionContext().onTriggerKeyDown(e)
  }

  return (
    <DisclosureTrigger
      ref={setTriggerRef}
      id={context().triggerId()}
      onKeyDown={onKeyDown}
      contextId={localProps.contextId}
      aria-disabled={context().disabled() ? 'true' : undefined}
      data-disabled={dataIf(context().disabled())}
      data-corvu-disclosure-trigger={undefined}
      data-corvu-accordion-trigger=""
      disabled={context().disabled() ? 'true' : undefined}
      {...(otherProps as DisclosureTriggerProps<T>)}
    />
  )
}

export default AccordionTrigger
