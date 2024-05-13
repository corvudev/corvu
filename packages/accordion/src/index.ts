import Content, {
  type AccordionContentCorvuProps as ContentCorvuProps,
  type AccordionContentElementProps as ContentElementProps,
  type AccordionContentProps as ContentProps,
  type AccordionContentSharedElementProps as ContentSharedElementProps,
} from '@src/Content'
import {
  type AccordionContextValue as ContextValue,
  useAccordionContext as useContext,
} from '@src/context'
import {
  type ContextValue as DisclosureContextValue,
  useContext as useDisclosureContext,
} from '@corvu/disclosure'
import Item, {
  type AccordionItemChildrenProps as ItemChildrenProps,
  type AccordionItemCorvuProps as ItemCorvuProps,
  type AccordionItemElementProps as ItemElementProps,
  type AccordionItemProps as ItemProps,
  type AccordionItemSharedElementProps as ItemSharedElementProps,
} from '@src/Item'
import {
  type AccordionItemContextValue as ItemContextValue,
  useAccordionItemContext as useItemContext,
} from '@src/itemContext'
import Root, {
  type AccordionRootChildrenProps as RootChildrenProps,
  type AccordionRootProps as RootProps,
} from '@src/Root'
import Trigger, {
  type AccordionTriggerCorvuProps as TriggerCorvuProps,
  type AccordionTriggerElementProps as TriggerElementProps,
  type AccordionTriggerProps as TriggerProps,
  type AccordionTriggerSharedElementProps as TriggerSharedElementProps,
} from '@src/Trigger'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  RootProps,
  RootChildrenProps,
  ItemCorvuProps,
  ItemSharedElementProps,
  ItemElementProps,
  ItemProps,
  ItemChildrenProps,
  TriggerCorvuProps,
  TriggerSharedElementProps,
  TriggerElementProps,
  TriggerProps,
  ContentCorvuProps,
  ContentSharedElementProps,
  ContentElementProps,
  ContentProps,
  ContextValue,
  ItemContextValue,
  DisclosureContextValue,
  DynamicProps,
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
