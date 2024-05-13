import {
  createAccordionItemContext,
  createInternalAccordionItemContext,
} from '@src/itemContext'
import {
  createMemo,
  createUniqueId,
  type JSX,
  mergeProps,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type {
  RootChildrenProps as DisclosureRootChildrenProps,
  RootProps as DisclosureRootProps,
} from '@corvu/disclosure'
import {
  Dynamic,
  type DynamicAttributes,
  type OverrideComponentProps,
} from '@corvu/utils/dynamic'
import createOnce from '@corvu/utils/create/once'
import createRegister from '@corvu/utils/create/register'
import Disclosure from '@corvu/disclosure'
import Fragment from '@corvu/utils/components/Fragment'
import { isFunction } from '@corvu/utils'
import { useInternalAccordionContext } from '@src/context'

const DEFAULT_ACCORDION_ITEM_ELEMENT = Fragment

export type AccordionItemProps<
  T extends ValidComponent = typeof DEFAULT_ACCORDION_ITEM_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * Value of the accordion item.
     * @defaultValue `createUniqueId()`
     */
    value?: string
    /**
     * Whether the accordion item is disabled. Used to override the default provided by `<Accordion.Root>`.
     */
    disabled?: boolean
    /**
     * The `id` attribute of the accordion item trigger element.
     * @defaultValue `createUniqueId()`
     */
    triggerId?: string
    children:
      | JSX.Element
      | ((
          props: AccordionItemChildrenProps & DisclosureRootChildrenProps,
        ) => JSX.Element)
  } & Omit<
      DisclosureRootProps,
      'expanded' | 'onExpandedChange' | 'initialExpanded' | 'children'
    >
>

/** Props that are passed to the Item component children callback. */
export type AccordionItemChildrenProps = {
  /** Value of the accordion item. */
  value: string
  /** Whether the accordion item is disabled. */
  disabled: boolean
  /** The `id` attribute of the accordion item trigger element. */
  triggerId: string | undefined
}

/** Context wrapper for the accordion item. Is required for every accordion item you create.
 *
 * @data `data-corvu-accordion-item` - Present if the item isn't rendered as a Fragment.
 */
const AccordionItem = <
  T extends ValidComponent = typeof DEFAULT_ACCORDION_ITEM_ELEMENT,
>(
  props: AccordionItemProps<T>,
) => {
  const defaultedProps = mergeProps(
    {
      accordionId: createUniqueId(),
    },
    props,
  )
  const [localProps, otherProps] = splitProps(defaultedProps, [
    'value',
    'disabled',
    'collapseBehavior',
    'triggerId',
    'contextId',
    'as',
    'children',
  ])

  const [triggerId, registerTriggerId, unregisterTriggerId] = createRegister({
    value: () => localProps.triggerId ?? createUniqueId(),
  })

  const context = createMemo(() =>
    useInternalAccordionContext(localProps.contextId),
  )

  const value = createMemo(() => localProps.value ?? createUniqueId())

  const expanded = createMemo(() => context().internalValue().includes(value()))
  const disabled = createMemo(
    () => (localProps.disabled ?? context().disabled()) as boolean,
  )
  const collapseBehavior = createMemo(
    () => localProps.collapseBehavior ?? context().collapseBehavior(),
  )

  const childrenProps: AccordionItemChildrenProps = {
    get value() {
      return value()
    },
    get disabled() {
      return disabled()
    },
    get triggerId() {
      return triggerId()
    },
  }

  const memoizedChildren = createOnce(() => localProps.children)

  const resolveChildren = (
    disclosureChildrenProps: DisclosureRootChildrenProps,
  ) => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      const mergedProps = mergeProps(disclosureChildrenProps, childrenProps)
      return children(mergedProps)
    }
    return children
  }

  const memoizedAccordionItem = createMemo(() => {
    const AccordionItemContext = createAccordionItemContext(
      localProps.contextId,
    )
    const InternalAccordionItemContext = createInternalAccordionItemContext(
      localProps.contextId,
    )

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          disabled,
          triggerId,
        }}
      >
        <InternalAccordionItemContext.Provider
          value={{
            value,
            disabled,
            triggerId,
            registerTriggerId,
            unregisterTriggerId,
          }}
        >
          <Dynamic
            as={localProps.as ?? DEFAULT_ACCORDION_ITEM_ELEMENT}
            data-corvu-accordion-item=""
            {...otherProps}
          >
            <Disclosure
              expanded={expanded()}
              onExpandedChange={(newExpanded) => {
                if (newExpanded === expanded() || disabled()) return
                context().toggleValue(value())
              }}
              collapseBehavior={collapseBehavior()}
              contextId={localProps.contextId}
              {...otherProps}
            >
              {(disclosureChildrenProps) =>
                resolveChildren(disclosureChildrenProps)
              }
            </Disclosure>
          </Dynamic>
        </InternalAccordionItemContext.Provider>
      </AccordionItemContext.Provider>
    )
  })

  return memoizedAccordionItem as unknown as JSX.Element
}

export default AccordionItem
