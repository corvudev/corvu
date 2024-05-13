import { type Accessor, createContext, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'

export type AccordionItemContextValue = {
  /** Value of the accordion item. */
  value: Accessor<string>
  /** Whether the accordion item is disabled. */
  disabled: Accessor<boolean>
  /** The `id` attribute of the accordion item trigger element. */
  triggerId: Accessor<string | undefined>
}

const AccordionItemContext = createContext<AccordionItemContextValue>()

export const createAccordionItemContext = (contextId?: string) => {
  if (contextId === undefined) return AccordionItemContext

  const context = createKeyedContext<AccordionItemContextValue>(
    `accordion-item-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the accordion. Optionally provide a contextId to access a keyed context. */
export const useAccordionItemContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(AccordionItemContext)
    if (!context) {
      throw new Error(
        '[corvu]: Accordion Item context not found. Make sure to wrap Accordion Item components in <Accordion.Item>',
      )
    }
    return context
  }

  const context = useKeyedContext<AccordionItemContextValue>(
    `accordion-item-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Accordion Item context with id "${contextId}" not found. Make sure to wrap Accordion Item components in <Accordion.Item contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalAccordionItemContextValue = AccordionItemContextValue & {
  registerTriggerId: () => void
  unregisterTriggerId: () => void
}

const InternalAccordionItemContext =
  createContext<InternalAccordionItemContextValue>()

export const createInternalAccordionItemContext = (contextId?: string) => {
  if (contextId === undefined) return InternalAccordionItemContext

  const context = createKeyedContext<InternalAccordionItemContextValue>(
    `accordion-item-internal-${contextId}`,
  )
  return context
}

export const useInternalAccordionItemContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalAccordionItemContext)
    if (!context) {
      throw new Error(
        '[corvu]: Accordion context not found. Make sure to wrap Accordion components in <Accordion.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalAccordionItemContextValue>(
    `accordion-item-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Accordion context with id "${contextId}" not found. Make sure to wrap Accordion components in <Accordion.Root contextId="${contextId}">`,
    )
  }
  return context
}
