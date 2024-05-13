import {
  type AccordionContextValue,
  useAccordionContext as useContext,
} from '@src/context'
import {
  type AccordionItemContextValue,
  useAccordionItemContext as useItemContext,
} from '@src/itemContext'
import {
  type ContentProps as DisclosureContentProps,
  type ContextValue as DisclosureContextValue,
  type TriggerProps as DisclosureTriggerProps,
  useContext as useDisclosureContext,
} from '@corvu/disclosure'
import Item, {
  type AccordionItemChildrenProps,
  type AccordionItemProps,
} from '@src/Item'
import Root, {
  type AccordionRootChildrenProps,
  type AccordionRootProps,
} from '@src/Root'
import Content from '@src/Content'
import Trigger from '@src/Trigger'

export type {
  AccordionRootProps as RootProps,
  AccordionRootChildrenProps as RootChildrenProps,
  AccordionItemProps as ItemProps,
  AccordionItemChildrenProps as ItemChildrenProps,
  DisclosureTriggerProps as TriggerProps,
  DisclosureContentProps as ContentProps,
  AccordionContextValue as ContextValue,
  AccordionItemContextValue as ItemContextValue,
  DisclosureContextValue,
}

export {
  Root,
  Item,
  Trigger,
  Content,
  useContext,
  useItemContext,
  useDisclosureContext,
}

const Accordion = Object.assign(Root, {
  Item,
  Trigger,
  Content,
  useContext,
  useItemContext,
  useDisclosureContext,
})

export default Accordion
