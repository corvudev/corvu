import {
  type CalendarContextBaseValue,
  type CalendarContextMultipleValue,
  type CalendarContextRangeValue,
  type CalendarContextSingleValue,
  type CalendarContextValue,
  useCalendarContext as useContext,
} from '@src/context'
import Cell, {
  type CalendarCellCorvuProps as CellCorvuProps,
  type CalendarCellElementProps as CellElementProps,
  type CalendarCellProps as CellProps,
  type CalendarCellSharedElementProps as CellSharedElementProps,
} from '@src/Cell'
import CellTrigger, {
  type CalendarCellTriggerCorvuProps as CellTriggerCorvuProps,
  type CalendarCellTriggerElementProps as CellTriggerElementProps,
  type CalendarCellTriggerProps as CellTriggerProps,
  type CalendarCellTriggerSharedElementProps as CellTriggerSharedElementProps,
} from '@src/CellTrigger'
import HeadCell, {
  type CalendarHeadCellCorvuProps as HeadCellCorvuProps,
  type CalendarHeadCellElementProps as HeadCellElementProps,
  type CalendarHeadCellProps as HeadCellProps,
  type CalendarHeadCellSharedElementProps as HeadCellSharedElementProps,
} from '@src/HeadCell'
import Label, {
  type CalendarLabelCorvuProps as LabelCorvuProps,
  type CalendarLabelElementProps as LabelElementProps,
  type CalendarLabelProps as LabelProps,
  type CalendarLabelSharedElementProps as LabelSharedElementProps,
} from '@src/Label'
import Nav, {
  type CalendarNavCorvuProps as NavCorvuProps,
  type CalendarNavElementProps as NavElementProps,
  type CalendarNavProps as NavProps,
  type CalendarNavSharedElementProps as NavSharedElementProps,
} from '@src/Nav'
import Root, {
  type CalendarRootBaseProps,
  type CalendarRootChildrenBaseProps,
  type CalendarRootChildrenMultipleProps,
  type CalendarRootChildrenProps,
  type CalendarRootChildrenRangeProps,
  type CalendarRootChildrenSingleProps,
  type CalendarRootMultipleProps,
  type CalendarRootProps,
  type CalendarRootRangeProps,
  type CalendarRootSingleProps,
} from '@src/Root'
import Table, {
  type CalendarTableCorvuProps as TableCorvuProps,
  type CalendarTableElementProps as TableElementProps,
  type CalendarTableProps as TableProps,
  type CalendarTableSharedElementProps as TableSharedElementProps,
} from '@src/Table'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  CalendarRootProps as RootProps,
  CalendarRootSingleProps as RootSingleProps,
  CalendarRootMultipleProps as RootMultipleProps,
  CalendarRootRangeProps as RootRangeProps,
  CalendarRootBaseProps as RootBaseProps,
  CalendarRootChildrenProps as RootChildrenProps,
  CalendarRootChildrenSingleProps as RootChildrenSingleProps,
  CalendarRootChildrenMultipleProps as RootChildrenMultipleProps,
  CalendarRootChildrenRangeProps as RootChildrenRangeProps,
  CalendarRootChildrenBaseProps as RootChildrenBaseProps,
  LabelCorvuProps,
  LabelSharedElementProps,
  LabelElementProps,
  LabelProps,
  NavCorvuProps,
  NavSharedElementProps,
  NavElementProps,
  NavProps,
  TableCorvuProps,
  TableSharedElementProps,
  TableElementProps,
  TableProps,
  HeadCellCorvuProps,
  HeadCellSharedElementProps,
  HeadCellElementProps,
  HeadCellProps,
  CellCorvuProps,
  CellSharedElementProps,
  CellElementProps,
  CellProps,
  CellTriggerCorvuProps,
  CellTriggerSharedElementProps,
  CellTriggerElementProps,
  CellTriggerProps,
  CalendarContextValue as ContextValue,
  CalendarContextSingleValue as ContextSingleValue,
  CalendarContextMultipleValue as ContextMultipleValue,
  CalendarContextRangeValue as ContextRangeValue,
  CalendarContextBaseValue as ContextBaseValue,
  DynamicProps,
}

export { Root, Label, Nav, Table, HeadCell, Cell, CellTrigger, useContext }

const Calendar = Object.assign(Root, {
  Label,
  Nav,
  Table,
  HeadCell,
  Cell,
  CellTrigger,
  useContext,
})

export default Calendar
