import type { Accessor, Setter } from 'solid-js'

export type ResizeHandle = {
  element: HTMLElement
  orientation: 'horizontal' | 'vertical'
  startIntersection: {
    handle: Accessor<ResizeHandle | null>
    setHandle: Setter<ResizeHandle | null>
  }
  endIntersection: {
    handle: Accessor<ResizeHandle | null>
    setHandle: Setter<ResizeHandle | null>
  }
  dragging: Accessor<boolean>
  setDragging: Setter<boolean>
  active: Accessor<boolean>
  setActive: Setter<boolean>
  onDrag: (start: number, delta: number) => void
  onDragEnd: () => void
}

export type DragTarget = 'handle' | 'startIntersection' | 'endIntersection'
export type ResizeHandleCallbacks = {
  onDragStart: (event: PointerEvent, target: DragTarget) => void
}

const resizeHandles = new Set<ResizeHandle>()

let startPos: { x: number; y: number } | null = null

const registerResizeHandle = (
  resizeHandle: ResizeHandle,
): ResizeHandleCallbacks => {
  resizeHandles.add(resizeHandle)
  for (const resizeHandle of resizeHandles) {
    for (const intersectionResizeHandle of resizeHandles) {
      if (
        resizeHandle.orientation === intersectionResizeHandle.orientation ||
        resizeHandle.element === intersectionResizeHandle.element
      ) {
        continue
      }

      const resizeHandleRect = resizeHandle.element.getBoundingClientRect()
      const intersectionResizeHandleRect =
        intersectionResizeHandle.element.getBoundingClientRect()

      const isStartIntersection =
        resizeHandle.orientation === 'horizontal'
          ? equalsWithTolerance(
              resizeHandleRect.top,
              intersectionResizeHandleRect.bottom,
            )
          : equalsWithTolerance(
              resizeHandleRect.left,
              intersectionResizeHandleRect.right,
            )
      const isEndIntersection =
        resizeHandle.orientation === 'horizontal'
          ? equalsWithTolerance(
              resizeHandleRect.bottom,
              intersectionResizeHandleRect.top,
            )
          : equalsWithTolerance(
              resizeHandleRect.right,
              intersectionResizeHandleRect.left,
            )

      if (isStartIntersection) {
        resizeHandle.startIntersection.setHandle(intersectionResizeHandle)
      }
      if (isEndIntersection) {
        resizeHandle.endIntersection.setHandle(intersectionResizeHandle)
      }
    }
  }

  return {
    onDragStart: (event: PointerEvent, target: DragTarget) =>
      onDragStart(resizeHandle, event, target),
  }
}

const unregisterResizeHandle = (resizeHandle: ResizeHandle) => {
  resizeHandles.delete(resizeHandle)
}

const onDragStart = (
  resizeHandle: ResizeHandle,
  event: PointerEvent,
  target: DragTarget,
) => {
  startPos = { x: event.clientX, y: event.clientY }
  resizeHandle.setDragging(true)
  if (target === 'startIntersection') {
    resizeHandle.startIntersection.handle()?.setDragging(true)
  }
  if (target === 'endIntersection') {
    resizeHandle.endIntersection.handle()?.setDragging(true)
  }
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('pointerup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
}

const onPointerMove = (event: PointerEvent) =>
  onMove(event.clientX, event.clientY)
const onTouchMove = (event: TouchEvent) => {
  if (!event.touches[0]) return
  onMove(event.touches[0].clientX, event.touches[0].clientY)
}

const onMove = (x: number, y: number) => {
  if (!startPos) return
  for (const resizeHandle of resizeHandles) {
    if (resizeHandle.dragging()) {
      resizeHandle.onDrag(
        resizeHandle.orientation === 'horizontal' ? startPos.x : startPos.y,
        resizeHandle.orientation === 'horizontal'
          ? x - startPos.x
          : y - startPos.y,
      )
    }
  }
}

const onDragEnd = () => {
  for (const resizeHandle of resizeHandles) {
    if (resizeHandle.dragging()) {
      resizeHandle.setDragging(false)
      resizeHandle.onDragEnd()
    }
  }
  startPos = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('pointerup', onDragEnd)
  window.removeEventListener('touchend', onDragEnd)
}

const INTERSECTION_TOLERANCE = 1

const equalsWithTolerance = (a: number, b: number) =>
  Math.abs(a - b) <= INTERSECTION_TOLERANCE

export { registerResizeHandle, unregisterResizeHandle }
