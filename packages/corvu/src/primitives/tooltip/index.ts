import Anchor, { type TooltipAnchorProps } from '@primitives/tooltip/Anchor'
import Arrow, { type TooltipArrowProps } from '@primitives/tooltip/Arrow'
import Content, { type TooltipContentProps } from '@primitives/tooltip/Content'
import Portal, { type TooltipPortalProps } from '@primitives/tooltip/Portal'
import Root, {
  type TooltipRootChildrenProps,
  type TooltipRootProps,
} from '@primitives/tooltip/Root'
import {
  type TooltipContextValue,
  useTooltipContext as useContext,
} from '@primitives/tooltip/context'
import Trigger, { type TooltipTriggerProps } from '@primitives/tooltip/Trigger'

export type {
  TooltipContextValue as ContextValue,
  TooltipRootProps as RootProps,
  TooltipRootChildrenProps as RootChildrenProps,
  TooltipAnchorProps as AnchorProps,
  TooltipTriggerProps as TriggerProps,
  TooltipPortalProps as PortalProps,
  TooltipContentProps as ContentProps,
  TooltipArrowProps as ArrowProps,
}

export { useContext, Root, Anchor, Trigger, Portal, Content, Arrow }

export default {
  useContext,
  Root,
  Anchor,
  Trigger,
  Portal,
  Content,
  Arrow,
}
