import {
  batch,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import DialogContent, {
  type DialogContentProps,
} from '@primitives/dialog/Content'
import {
  findClosestSnapPoint,
  locationIsDraggable,
  resolveSnapPoint,
} from '@primitives/drawer/lib'
import type { Axis } from '@lib/types'
import { dataIf } from '@lib/utils'
import { getScrollAtLocation } from '@lib/scroll'
import { useInternalDialogContext } from '@primitives/dialog/context'
import { useInternalDrawerContext } from '@primitives/drawer/context'

const DEFAULT_DRAWER_CONTENT_ELEMENT = 'div'

/** Content of the drawer. Can be animated.
 *
 * @data `data-corvu-dialog-content` - Present on every drawer/dialog content element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 * @data `data-transitioning` - Present when the drawer is transitioning (opening, closing or snapping).
 * @data `data-opening` - Present when the drawer is in the open transition.
 * @data `data-closing` - Present when the drawer is in the close transition.
 * @data `data-snapping` - Present when the drawer is transitioning after the user stops dragging.
 */
const DrawerContent = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_CONTENT_ELEMENT,
>(
  props: DialogContentProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId', 'style'])

  let pointerDown = false
  let dragStartPos: number | null = null

  // Values used to handle dragging on scrollable elements.
  let currentPointerStart: [number, number] = [0, 0]

  // Values used to calculate the velocity of the drawer when the user releases it.
  let cachedMoveTimestamp: Date
  let cachedTranslate = 0

  const drawerContext = createMemo(() =>
    useInternalDrawerContext(localProps.contextId),
  )
  const dialogContext = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const snapPoints = createMemo(() =>
    drawerContext()
      .snapPoints()
      .map((snapPoint, index) =>
        resolveSnapPoint(
          snapPoint,
          drawerContext().drawerSize(),
          index,
          drawerContext().breakPoints(),
        ),
      ),
  )

  const transformValue = createMemo(() => {
    switch (drawerContext().side()) {
      case 'top':
        return `translate3d(0, ${-drawerContext().translate()}px, 0)`
      case 'bottom':
        return `translate3d(0, ${drawerContext().translate()}px, 0)`
      case 'right':
        return `translate3d(${drawerContext().translate()}px, 0, 0)`
      case 'left':
        return `translate3d(${-drawerContext().translate()}px, 0, 0)`
    }
  })

  createEffect(() => {
    if (!dialogContext().open()) return

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('touchend', onPointerUp)

    onCleanup(() => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('touchend', onPointerUp)
    })
  })

  const onPointerDown = (event: PointerEvent) => {
    if (
      !locationIsDraggable(
        event.target as HTMLElement,
        dialogContext().contentRef()!,
      )
    )
      return

    pointerDown = true
    if (drawerContext().handleScrollableElements()) {
      currentPointerStart = [event.clientX, event.clientY]
    }
  }

  const onPointerMove = (event: PointerEvent) => {
    onMove(event.target as HTMLElement, event.clientX, event.clientY)
  }
  const onTouchMove = (event: TouchEvent) => {
    if (!event.touches[0]) return
    onMove(
      event.target as HTMLElement,
      event.touches[0].clientX,
      event.touches[0].clientY,
    )
  }

  const onMove = (target: HTMLElement, x: number, y: number) => {
    if (!pointerDown) return

    if (!drawerContext().isDragging() || dragStartPos === null) {
      if (drawerContext().handleScrollableElements()) {
        const delta = [x, y].map(
          (pointer, i) => currentPointerStart[i]! - pointer,
        ) as [number, number]
        const axis: Axis = Math.abs(delta[0]) > Math.abs(delta[1]) ? 'x' : 'y'
        const axisDelta = axis === 'x' ? delta[0] : delta[1]

        if (Math.abs(axisDelta) < 0.3) return

        const wrapper = dialogContext().contentRef()!

        const [availableScroll, availableScrollTop] = getScrollAtLocation(
          target,
          axis,
          wrapper,
        )

        // On firefox, availableScroll can be 1 even if there is no scroll available.
        if (
          (axisDelta > 0 && Math.abs(availableScroll) > 1) ||
          (axisDelta < 0 && Math.abs(availableScrollTop) > 0)
        ) {
          onPointerUp()
          return
        }
      }

      switch (drawerContext().side()) {
        case 'top':
        case 'bottom':
          dragStartPos = y
          break
        case 'right':
        case 'left':
          dragStartPos = x
      }

      cachedMoveTimestamp = new Date()
      cachedTranslate = drawerContext().translate()

      batch(() => {
        drawerContext().setIsDragging(true)
        drawerContext().setTransitionState(null)
      })
    }

    let delta: number
    switch (drawerContext().side()) {
      case 'top':
        delta = -(dragStartPos - y)
        break
      case 'bottom':
        delta = dragStartPos - y
        break
      case 'right':
        delta = dragStartPos - x
        break
      case 'left':
        delta = -(dragStartPos - x)
        break
    }
    delta -= drawerContext().resolvedActiveSnapPoint().offset

    if (delta > 0) delta = drawerContext().dampFunction(delta)

    const now = new Date()
    if (
      now.getTime() - cachedMoveTimestamp.getTime() >
      drawerContext().velocityCacheReset()
    ) {
      cachedMoveTimestamp = now
      cachedTranslate = drawerContext().translate()
    }

    drawerContext().setTranslate(-delta)
  }

  const onPointerUp = () => {
    pointerDown = false

    if (!drawerContext().isDragging()) return

    const now = new Date()
    const velocity = drawerContext().velocityFunction(
      -(cachedTranslate - drawerContext().translate()),
      now.getTime() - cachedMoveTimestamp.getTime() || 1,
    )

    const translateWithVelocity = drawerContext().translate() * velocity

    const closestSnapPoint = findClosestSnapPoint(
      snapPoints(),
      drawerContext().translate(),
      translateWithVelocity,
      drawerContext().allowSkippingSnapPoints(),
    )

    batch(() => {
      drawerContext().setTransitionState('snapping')
      drawerContext().setIsDragging(false)
    })

    batch(() => {
      drawerContext().setActiveSnapPoint(closestSnapPoint.value)
      if (closestSnapPoint.offset === drawerContext().drawerSize()) {
        dialogContext().setOpen(false)
      } else {
        drawerContext().setTranslate(closestSnapPoint.offset)
        const transitionDuration =
          parseFloat(drawerContext().drawerStyles()!.transitionDuration) * 1000
        if (transitionDuration === 0) {
          drawerContext().setTransitionState(null)
        }
      }
    })
  }

  return (
    <DialogContent
      contextId={localProps.contextId}
      style={{
        transform: transformValue(),
        'transition-duration': drawerContext().isDragging() ? '0ms' : undefined,
        'user-select': 'none',
        ...localProps.style,
      }}
      onPointerDown={onPointerDown}
      onTransitionEnd={() => {
        batch(() => {
          if (drawerContext().transitionState() === 'closing') {
            dialogContext().setOpen(false)
          }
          drawerContext().setTransitionState(null)
        })
      }}
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      data-opening={dataIf(
        drawerContext().transitionState() === 'opening' &&
          drawerContext().isTransitioning(),
      )}
      data-closing={dataIf(
        drawerContext().transitionState() === 'closing' &&
          drawerContext().isTransitioning(),
      )}
      data-snapping={dataIf(
        drawerContext().transitionState() === null &&
          drawerContext().isTransitioning(),
      )}
      {...(otherProps as DialogContentProps<T>)}
    />
  )
}

export default DrawerContent
