import Anchor, { type TooltipAnchorProps } from '@src/Anchor'
import Arrow, { type TooltipArrowProps } from '@src/Arrow'
import Content, { type TooltipContentProps } from '@src/Content'
import type {
  FloatingOptions,
  FloatingState,
} from '@corvu/utils/create/floating'
import Portal, { type TooltipPortalProps } from '@src/Portal'
import Root, {
  type TooltipRootChildrenProps,
  type TooltipRootProps,
} from '@src/Root'
import {
  type TooltipContextValue,
  useTooltipContext as useContext,
} from '@src/context'
import Trigger, { type TooltipTriggerProps } from '@src/Trigger'

export type {
  TooltipRootProps as RootProps,
  TooltipRootChildrenProps as RootChildrenProps,
  TooltipAnchorProps as AnchorProps,
  TooltipTriggerProps as TriggerProps,
  TooltipPortalProps as PortalProps,
  TooltipContentProps as ContentProps,
  TooltipArrowProps as ArrowProps,
  TooltipContextValue as ContextValue,
  FloatingOptions,
  FloatingState,
}

export { Root, Anchor, Trigger, Portal, Content, Arrow, useContext }

const Tooltip = Object.assign(Root, {
  Anchor,
  Trigger,
  Portal,
  Content,
  Arrow,
  useContext,
})

export default Tooltip
