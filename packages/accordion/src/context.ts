import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'

export type AccordionContextValue = {
  /** Whether multiple accordion items can be expanded at the same time. */
  multiple: Accessor<boolean>
  /** The value of the accordion. */
  value: Accessor<string | string[] | null>
  /** Callback fired when the value changes. */
  setValue: Setter<string | string[] | null>
  /** Whether the accordion can be fully collapsed. */
  collapsible: Accessor<boolean>
  /** Whether the accordion is disabled. */
  disabled: Accessor<boolean>
  /** The orientation of the accordion. */
  orientation: Accessor<'horizontal' | 'vertical'>
  /** Whether the accordion should loop when navigating with the keyboard. */
  loop: Accessor<boolean>
  /** The text direction of the accordion. */
  textDirection: Accessor<'ltr' | 'rtl'>
  /** Whether the accordion item content should be removed or hidden when collapsed. */
  collapseBehavior: Accessor<'remove' | 'hide'>
}

const AccordionContext = createContext<AccordionContextValue>()

export const createAccordionContext = (contextId?: string) => {
  if (contextId === undefined) return AccordionContext

  const context = createKeyedContext<AccordionContextValue>(
    `accordion-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the accordion. Optionally provide a contextId to access a keyed context. */
export const useAccordionContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(AccordionContext)
    if (!context) {
      throw new Error(
        '[corvu]: Accordion context not found. Make sure to wrap Accordion components in <Accordion.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<AccordionContextValue>(
    `accordion-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Accordion context with id "${contextId}" not found. Make sure to wrap Accordion components in <Accordion.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalAccordionContextValue = AccordionContextValue & {
  internalValue: Accessor<string[]>
  toggleValue: (value: string) => void
  registerTrigger: (element: HTMLElement) => void
  unregisterTrigger: (element: HTMLElement) => void
  onTriggerKeyDown: (event: KeyboardEvent) => void
  onTriggerFocus: (event: FocusEvent) => void
}

const InternalAccordionContext = createContext<InternalAccordionContextValue>()

export const createInternalAccordionContext = (contextId?: string) => {
  if (contextId === undefined) return InternalAccordionContext

  const context = createKeyedContext<InternalAccordionContextValue>(
    `accordion-internal-${contextId}`,
  )
  return context
}

export const useInternalAccordionContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalAccordionContext)
    if (!context) {
      throw new Error(
        '[corvu]: Accordion context not found. Make sure to wrap Accordion components in <Accordion.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalAccordionContextValue>(
    `accordion-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Accordion context with id "${contextId}" not found. Make sure to wrap Accordion components in <Accordion.Root contextId="${contextId}">`,
    )
  }
  return context
}
