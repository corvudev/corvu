import Content, {
  type DisclosureContentCorvuProps as ContentCorvuProps,
  type DisclosureContentElementProps as ContentElementProps,
  type DisclosureContentProps as ContentProps,
  type DisclosureContentSharedElementProps as ContentSharedElementProps,
} from '@src/Content'
import {
  type DisclosureContextValue as ContextValue,
  useDisclosureContext as useContext,
} from '@src/context'
import Root, {
  type DisclosureRootChildrenProps as RootChildrenProps,
  type DisclosureRootProps as RootProps,
} from '@src/Root'
import Trigger, {
  type DisclosureTriggerCorvuProps as TriggerCorvuProps,
  type DisclosureTriggerElementProps as TriggerElementProps,
  type DisclosureTriggerProps as TriggerProps,
  type DisclosureTriggerSharedElementProps as TriggerSharedElementProps,
} from '@src/Trigger'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  RootProps,
  RootChildrenProps,
  TriggerCorvuProps,
  TriggerSharedElementProps,
  TriggerElementProps,
  TriggerProps,
  ContentCorvuProps,
  ContentSharedElementProps,
  ContentElementProps,
  ContentProps,
  ContextValue,
  DynamicProps,
}

export { Root, Trigger, Content, useContext }

const Disclosure = Object.assign(Root, {
  Trigger,
  Content,
  useContext,
})

export default Disclosure
