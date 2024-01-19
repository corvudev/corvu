import Content, {
  type DisclosureContentProps,
} from '@primitives/disclosure/Content'
import {
  type DisclosureContextValue,
  useDisclosureContext as useContext,
} from '@primitives/disclosure/context'
import Root, {
  type DisclosureRootChildrenProps,
  type DisclosureRootProps,
} from '@primitives/disclosure/Root'
import Trigger, {
  type DisclosureTriggerProps,
} from '@primitives/disclosure/Trigger'

export type {
  DisclosureContextValue as ContextValue,
  DisclosureRootProps as RootProps,
  DisclosureRootChildrenProps as RootChildrenProps,
  DisclosureTriggerProps as TriggerProps,
  DisclosureContentProps as ContentProps,
}

export { useContext, Root, Trigger, Content }

export default {
  useContext,
  Root,
  Trigger,
  Content,
}
