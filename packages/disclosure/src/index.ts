import Content, { type DisclosureContentProps } from '@src/Content'
import {
  type DisclosureContextValue,
  useDisclosureContext as useContext,
} from '@src/context'
import Root, {
  type DisclosureRootChildrenProps,
  type DisclosureRootProps,
} from '@src/Root'
import Trigger, { type DisclosureTriggerProps } from '@src/Trigger'

export type {
  DisclosureRootProps as RootProps,
  DisclosureRootChildrenProps as RootChildrenProps,
  DisclosureTriggerProps as TriggerProps,
  DisclosureContentProps as ContentProps,
  DisclosureContextValue as ContextValue,
}

export { Root, Trigger, Content, useContext }

const Disclosure = Object.assign(Root, {
  Trigger,
  Content,
  useContext,
})

export default Disclosure
