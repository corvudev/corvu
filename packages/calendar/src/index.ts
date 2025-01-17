import {
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
import Navigation, {
  type CalendarNavigationCorvuProps as NavigationCorvuProps,
  type CalendarNavigationElementProps as NavigationElementProps,
  type CalendarNavigationProps as NavigationProps,
  type CalendarNavigationSharedElementProps as NavigationSharedElementProps,
} from '@src/Navigation'
import Root, {
  type CalendarRootChildrenProps,
  type CalendarRootProps,
  type DateValue,
} from '@src/Root'
import Table, {
  type CalendarTableCorvuProps as TableCorvuProps,
  type CalendarTableElementProps as TableElementProps,
  type CalendarTableProps as TableProps,
  type CalendarTableSharedElementProps as TableSharedElementProps,
} from '@src/Table'
import View, {
  type CalendarViewCorvuProps as ViewCorvuProps,
  type CalendarViewElementProps as ViewElementProps,
  type CalendarViewProps as ViewProps,
  type CalendarViewSharedElementProps as ViewSharedElementProps,
} from '@src/View'
import type { DynamicProps } from '@corvu/utils/dynamic'

export type {
  CalendarRootProps as RootProps,
  CalendarRootChildrenProps as RootChildrenProps,
  LabelCorvuProps,
  LabelSharedElementProps,
  LabelElementProps,
  LabelProps,
  NavigationCorvuProps,
  NavigationSharedElementProps,
  NavigationElementProps,
  NavigationProps,
  ViewCorvuProps,
  ViewSharedElementProps,
  ViewElementProps,
  ViewProps,
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
  DateValue,
  DynamicProps,
}

export { Root, useContext }

const Calendar = Object.assign(Root, {
  Label,
  Navigation,
  View,
  Table,
  HeadCell,
  Cell,
  CellTrigger,
  useContext,
})

export default Calendar
