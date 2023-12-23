import {
  Close,
  Description,
  Label,
  Overlay,
  Portal,
  Trigger,
  useContext as useDialogContext,
} from '@primitives/dialog'
import {
  type DrawerContextValue,
  useDrawerContext as useContext,
} from '@primitives/drawer/Context'
import Root, {
  DefaultBreakpoint,
  type DrawerRootChildrenProps,
  type DrawerRootProps,
} from '@primitives/drawer/Root'
import Content from '@primitives/drawer/Content'

export type {
  DrawerContextValue as ContextValue,
  DrawerRootChildrenProps as RootChildrenProps,
  DrawerRootProps as RootProps,
}

export {
  DefaultBreakpoint,
  useContext,
  useDialogContext,
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
}

export default {
  DefaultBreakpoint,
  useContext,
  useDialogContext,
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Label,
  Description,
  Close,
}
