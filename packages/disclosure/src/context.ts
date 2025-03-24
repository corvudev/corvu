import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import {
  createKeyedContext,
  useKeyedContext,
} from '@corvu/utils/create/keyedContext'

export type DisclosureContextValue = {
  /** Whether the disclosure is expanded. */
  expanded: Accessor<boolean>
  /** Callback fired when the expanded state changes. */
  setExpanded: Setter<boolean>
  /** Whether the disclosure content should be removed or hidden when collapsed. */
  collapseBehavior: Accessor<'remove' | 'hide'>
  /** Whether the initial open animation of the disclosure content should be prevented. */
  preventInitialContentAnimation: Accessor<boolean>
  /** The `id` attribute of the disclosure content element. */
  disclosureId: Accessor<string>
  /** Whether the disclosure content is present. This differes from `expanded` as it tracks pending animations. */
  contentPresent: Accessor<boolean>
  /** The disclosure content element. */
  contentRef: Accessor<HTMLElement | null>
  /** The current size of the disclosure content. Useful if you want to animate width or height. `[width, height]` */
  contentSize: Accessor<[number, number] | null>
}

const DisclosureContext = createContext<DisclosureContextValue>()

export const createDisclosureContext = (contextId?: string) => {
  if (contextId === undefined) return DisclosureContext

  const context = createKeyedContext<DisclosureContextValue>(
    `disclosure-${contextId}`,
  )
  return context
}

/** Context which exposes various properties to interact with the disclosure. Optionally provide a contextId to access a keyed context. */
export const useDisclosureContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(DisclosureContext)
    if (!context) {
      throw new Error(
        '[corvu]: Disclosure context not found. Make sure to wrap Disclosure components in <Disclosure.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<DisclosureContextValue>(
    `disclosure-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Disclosure context with id "${contextId}" not found. Make sure to wrap Disclosure components in <Disclosure.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalDisclosureContextValue = DisclosureContextValue & {
  setContentRef: (element: HTMLElement) => void
}

const InternalDisclosureContext =
  createContext<InternalDisclosureContextValue>()

export const createInternalDisclosureContext = (contextId?: string) => {
  if (contextId === undefined) return InternalDisclosureContext

  const context = createKeyedContext<InternalDisclosureContextValue>(
    `disclosure-internal-${contextId}`,
  )
  return context
}

export const useInternalDisclosureContext = (contextId?: string) => {
  if (contextId === undefined) {
    const context = useContext(InternalDisclosureContext)
    if (!context) {
      throw new Error(
        '[corvu]: Disclosure context not found. Make sure to wrap Disclosure components in <Disclosure.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalDisclosureContextValue>(
    `disclosure-internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Disclosure context with id "${contextId}" not found. Make sure to wrap Disclosure components in <Disclosure.Root contextId="${contextId}">`,
    )
  }
  return context
}
