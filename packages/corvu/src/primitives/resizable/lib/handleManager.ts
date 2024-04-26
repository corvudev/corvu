import type {
  CursorStyle,
  DragTarget,
  Handle,
  HandleCallbacks,
  HoverState,
} from '@primitives/resizable/lib/types'
import {
  resetResizeConstraints,
  setGlobalCursorStyle,
} from '@primitives/resizable/lib/cursor'
import { batch } from 'solid-js'
import { some } from '@lib/utils'

const handles: Handle[] = []
let dragStartPos: { x: number; y: number } | null = null
let globalHovered: HoverState = null

const INTERSECTION_TOLERANCE = 1
const equalsWithTolerance = (a: number, b: number) =>
  Math.abs(a - b) <= INTERSECTION_TOLERANCE

/**
 * Registers a resize handle and returns callback functions to handle drag events.
 * Handles need to be registered globally so we can detect intersections across resizable instances.
 * The cursor style has to be handled globally too.
 */
const registerHandle = (handle: Handle): HandleCallbacks => {
  handles.push(handle)

  for (const handle of handles) {
    for (const compareHandle of handles) {
      if (
        handle.orientation === compareHandle.orientation ||
        handle.element === compareHandle.element
      ) {
        continue
      }

      const handleRect = handle.element.getBoundingClientRect()
      const compareHandleRect = compareHandle.element.getBoundingClientRect()

      if (handle.orientation === 'horizontal') {
        if (
          handleRect.left > compareHandleRect.right ||
          handleRect.right < compareHandleRect.left
        ) {
          continue
        }
      }
      if (handle.orientation === 'vertical') {
        if (
          handleRect.top > compareHandleRect.bottom ||
          handleRect.bottom < compareHandleRect.top
        ) {
          continue
        }
      }

      const isStartIntersection =
        handle.orientation === 'horizontal'
          ? equalsWithTolerance(handleRect.top, compareHandleRect.bottom)
          : equalsWithTolerance(handleRect.left, compareHandleRect.right)
      const isEndIntersection =
        handle.orientation === 'horizontal'
          ? equalsWithTolerance(handleRect.bottom, compareHandleRect.top)
          : equalsWithTolerance(handleRect.right, compareHandleRect.left)

      if (isStartIntersection) {
        handle.startIntersection.setHandle(compareHandle)
      }
      if (isEndIntersection) {
        handle.endIntersection.setHandle(compareHandle)
      }
    }
  }

  return {
    onDragStart: (event: PointerEvent, target: DragTarget) =>
      onDragStart(handle, event, target),
    onHoveredChange: (state: HoverState) => {
      globalHovered = state

      const dragging = !!dragStartPos

      let cursorStyle: CursorStyle | null = null
      batch(() => {
        switch (state) {
          case 'handle': {
            const startHandle = handle.startIntersection.handle()
            const endHandle = handle.endIntersection.handle()

            if (!dragging) {
              handle.setActive(true)
              startHandle?.setActive(false)
              endHandle?.setActive(false)
            }

            startHandle?.setHoveredAsIntersection(false)
            endHandle?.setHoveredAsIntersection(false)

            cursorStyle = handle.orientation
            break
          }
          case 'startIntersection': {
            const startHandle = handle.startIntersection.handle()

            if (!dragging) {
              startHandle?.setActive(true)
            }
            startHandle?.setHoveredAsIntersection(true)

            cursorStyle = 'both'
            break
          }
          case 'endIntersection': {
            const endHandle = handle.endIntersection.handle()

            if (!dragging) {
              endHandle?.setActive(true)
            }

            endHandle?.setHoveredAsIntersection(true)

            cursorStyle = 'both'
            break
          }
          case null: {
            const startHandle = handle.startIntersection.handle()
            const endHandle = handle.endIntersection.handle()

            if (!dragging && !handle.focused()) {
              handle.setActive(false)
              startHandle?.setActive(false)
              endHandle?.setActive(false)
            }

            startHandle?.setHoveredAsIntersection(false)
            endHandle?.setHoveredAsIntersection(false)

            cursorStyle = null
            break
          }
        }
        if (!dragging && handle.handleCursorStyle()) {
          setGlobalCursorStyle(cursorStyle)
        }
      })
    },
  }
}

const unregisterHandle = (handle: Handle) => {
  handles.splice(handles.indexOf(handle), 1)
}

const onDragStart = (
  handle: Handle,
  event: PointerEvent,
  target: DragTarget,
) => {
  dragStartPos = { x: event.clientX, y: event.clientY }
  batch(() => {
    handle.setDragging(true)
    if (target === 'startIntersection') {
      handle.startIntersection.handle()?.setDragging(true)
    }
    if (target === 'endIntersection') {
      handle.endIntersection.handle()?.setDragging(true)
    }
  })
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('pointerup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
  window.addEventListener('contextmenu', onDragEnd)
}

const onPointerMove = (event: PointerEvent) =>
  onMove(event.clientX, event.clientY, event.altKey)
const onTouchMove = (event: TouchEvent) => {
  if (!event.touches[0]) return
  onMove(event.touches[0].clientX, event.touches[0].clientY, event.altKey)
}

let altKeyCache = false
const onMove = (x: number, y: number, altKey: boolean) => {
  if (!dragStartPos) return
  if (handles.some((handle) => handle.dragging() && handle.altKey === 'only')) {
    altKey = true
  }
  if (handles.some((handle) => handle.dragging() && handle.altKey === false)) {
    altKey = false
  }

  if (altKeyCache !== altKey) {
    dragStartPos = { x, y }
    altKeyCache = altKey
  }
  for (const handle of handles) {
    if (!handle.dragging()) continue
    handle.onDrag(
      handle.orientation === 'horizontal'
        ? x - dragStartPos.x
        : y - dragStartPos.y,
      altKey,
    )
  }
}

const onDragEnd = () => {
  batch(() => {
    // While dragging, active states are locked and we need to evaluate them on drag end
    for (const handle of handles) {
      if (!handle.dragging()) {
        if (
          some(handle.hovered, handle.focused, handle.hoveredAsIntersection)
        ) {
          handle.setActive(true)
          if (handle.handleCursorStyle()) {
            setGlobalCursorStyle(handle.orientation)
          }
        }
      } else {
        handle.setDragging(false)
        handle.onDragEnd()

        if (!handle.hovered() && !handle.hoveredAsIntersection()) {
          handle.setActive(false)
        }

        if (!globalHovered && handle.handleCursorStyle()) {
          setGlobalCursorStyle(null)
        }
      }
    }
  })

  resetResizeConstraints()
  dragStartPos = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('pointerup', onDragEnd)
  window.removeEventListener('touchend', onDragEnd)
  window.removeEventListener('contextmenu', onDragEnd)
}

export { registerHandle, unregisterHandle }
