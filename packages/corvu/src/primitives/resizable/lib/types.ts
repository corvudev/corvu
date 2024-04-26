import type { Accessor, Setter } from 'solid-js'
import type { Size } from '@lib/types'

export type PanelData = {
  id: string
  element: HTMLElement
  initialSize?: number
  minSize?: Size
  maxSize?: Size
  collapsible: boolean
  collapsedSize?: Size
  collapseThreshold?: Size
  onResize?: (size: number) => void
  onCollapse?: () => void
  onExpand?: () => void
}

export type PanelInstance = {
  data: PanelData
  size: Accessor<number>
  resize: (size: Size, strategy: ResizeStrategy) => void
  collapse: (strategy: ResizeStrategy) => void
  expand: (strategy: ResizeStrategy) => void
}

export type Handle = {
  element: HTMLElement
  orientation: 'horizontal' | 'vertical'
  altKey: boolean | 'only'
  handleCursorStyle: Accessor<boolean>
  startIntersection: {
    handle: Accessor<Handle | null>
    setHandle: (handle: Handle | null) => void
  }
  endIntersection: {
    handle: Accessor<Handle | null>
    setHandle: (handle: Handle | null) => void
  }
  hovered: Accessor<HoverState>
  focused: Accessor<boolean>
  hoveredAsIntersection: Accessor<boolean>
  setHoveredAsIntersection: Setter<boolean>
  dragging: Accessor<boolean>
  setDragging: Setter<boolean>
  active: Accessor<boolean>
  setActive: Setter<boolean>
  onDrag: (delta: number, altKey: boolean) => void
  onDragEnd: () => void
}

export type DragTarget = 'handle' | 'startIntersection' | 'endIntersection'
export type HandleCallbacks = {
  onDragStart: (event: PointerEvent, target: DragTarget) => void
  onHoveredChange: (state: HoverState) => void
}

export type HoverState =
  | 'handle'
  | 'startIntersection'
  | 'endIntersection'
  | null
export type CursorStyle = 'horizontal' | 'vertical' | 'both' | null

export type ResizeStrategy = 'preceding' | 'following' | 'both'
