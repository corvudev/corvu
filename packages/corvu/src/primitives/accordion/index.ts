import {
  type AccordionContextValue,
  useAccordionContext as useContext,
} from '@primitives/accordion/context'
import {
  type AccordionItemContextValue,
  useAccordionItemContext as useItemContext,
} from '@primitives/accordion/itemContext'
import {
  type ContentProps,
  type ContextValue as DisclosureContextValue,
  useContext as useDisclosureContext,
} from '@primitives/disclosure'
import Item, {
  type AccordionItemChildrenProps,
  type AccordionItemProps,
} from '@primitives/accordion/Item'
import Root, {
  type AccordionRootChildrenProps,
  type AccordionRootProps,
} from '@primitives/accordion/Root'
import Trigger, {
  type AccordionTriggerProps,
} from '@primitives/accordion/Trigger'
import Content from '@primitives/accordion/Content'

export type {
  AccordionContextValue as ContextValue,
  AccordionItemContextValue as ItemContextValue,
  DisclosureContextValue,
  AccordionRootProps as RootProps,
  AccordionRootChildrenProps as RootChildrenProps,
  AccordionItemProps as ItemProps,
  AccordionItemChildrenProps as ItemChildrenProps,
  AccordionTriggerProps as TriggerProps,
  ContentProps,
}

export {
  useContext,
  useItemContext,
  useDisclosureContext,
  Root,
  Item,
  Trigger,
  Content,
}

export const Accordion = Object.assign(Root, {
  useContext,
  useItemContext,
  useDisclosureContext,
  Item,
  Trigger,
  Content,
})
