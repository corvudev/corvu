import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import Disclosure, {
  type TriggerProps as DisclosureTriggerProps,
} from '@corvu/disclosure'
import { callEventHandler } from '@corvu/utils/dom'
import { dataIf } from '@corvu/utils'
import type { OverrideComponentProps } from '@corvu/utils/dynamic'
import { useInternalAccordionContext } from '@src/context'
import { useInternalAccordionItemContext } from '@src/itemContext'

const DEFAULT_ACCORDION_TRIGGER_ELEMENT = 'button'

/** Button that changes the open state of the accordion item when clicked.
 *
 * @data `data-corvu-accordion-trigger` - Present on every accordion trigger element.
 * @data `data-expanded` - Present when the accordion is expanded.
 * @data `data-collapsed` - Present when the accordion is collapsed.
 * @data `data-disabled` - Present when the accordion trigger is disabled.
 */
const AccordionTrigger = <
  T extends ValidComponent = typeof DEFAULT_ACCORDION_TRIGGER_ELEMENT,
>(
  props: OverrideComponentProps<
    T,
    DisclosureTriggerProps<T> & {
      /** @hidden */
      onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    }
  >,
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
    <Disclosure.Trigger
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
