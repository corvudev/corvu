import {
  resolveSnapPoint,
  findClosestSnapPoint,
  getScrollables,
  targetIsScrollable,
  targetIsScrolled,
  sideToDirection,
} from '@lib/drawer'
import { dataIf } from '@lib/utils'
import DialogContent, { DialogContentProps } from '@primitives/dialog/Content'
import { useInternalDialogContext } from '@primitives/dialog/Context'
import { useInternalDrawerContext } from '@primitives/drawer/Context'
import {
  batch,
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
} from 'solid-js'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DRAWER_CONTENT_ELEMENT = 'div'

/** Content of the drawer. Can be animated.
 *
 * @data `data-corvu-dialog-content` - Present on every drawer/dialog content element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 * @data `data-transitioning` - Present when the drawer is currently transitioning.
 */
const DrawerContent = <
  T extends ValidComponent = typeof DEFAULT_DRAWER_CONTENT_ELEMENT,
>(
  props: DialogContentProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['contextId', 'style'])

  let pointerDown = false
  let pointerDownPos: number | null = null
  let dragStartPos: number | null = null

  // Values used to handle dragging on scrollable elements.
  let targetedScrollableElements: HTMLElement[] = []
  const originalScrollOverflows: string[] = []
  const originalScrollOffsets: { scrollTop: number; scrollLeft: number }[] = []

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
    pointerDown = true
    switch (drawerContext().side()) {
      case 'top':
      case 'bottom':
        pointerDownPos = event.clientY
        break
      case 'right':
      case 'left':
        pointerDownPos = event.clientX
    }

    if (drawerContext().handleScrollableElements()) {
      targetedScrollableElements = getScrollables(event.target as HTMLElement)
      targetedScrollableElements.forEach((targetedScrollableElement) => {
        originalScrollOverflows.push(
          targetedScrollableElement.style.overflow || '',
        )
        originalScrollOffsets.push({
          scrollTop: targetedScrollableElement.scrollTop,
          scrollLeft: targetedScrollableElement.scrollLeft,
        })
      })
    }
  }

  const onPointerMove = (event: PointerEvent) => {
    onMove(event.target as HTMLElement, event.clientY, event.clientX)
  }
  const onTouchMove = (event: TouchEvent) => {
    if (!event.touches[0]) return
    onMove(
      event.target as HTMLElement,
      event.touches[0].clientY,
      event.touches[0].clientX,
    )
  }

  const onMove = (target: HTMLElement, y: number, x: number) => {
    if (!pointerDown || pointerDownPos === null) return

    if (!drawerContext().isDragging() || dragStartPos === null) {
      if (drawerContext().handleScrollableElements()) {
        let deviation: number
        switch (drawerContext().side()) {
          case 'top':
            deviation = -(pointerDownPos - y)
            break
          case 'bottom':
            deviation = pointerDownPos - y
            break
          case 'right':
            deviation = pointerDownPos - x
            break
          case 'left':
            deviation = -(pointerDownPos - x)
            break
        }
        deviation -= drawerContext().resolvedActiveSnapPoint().offset

        const direction = sideToDirection(drawerContext().side())

        if (targetIsScrolled(target, drawerContext().side())) {
          onPointerUp()
          return
        }
        if (
          deviation > snapPoints()[snapPoints().length - 1]!.offset &&
          targetIsScrollable(target, direction)
        ) {
          onPointerUp()
          return
        }
        if (
          targetedScrollableElements.some((targetedScrollableElement, idx) => {
            switch (direction) {
              case 'y':
                return (
                  targetedScrollableElement.scrollLeft !==
                  originalScrollOffsets[idx]!.scrollLeft
                )
              case 'x':
                return (
                  targetedScrollableElement.scrollTop !==
                  originalScrollOffsets[idx]!.scrollTop
                )
            }
          })
        ) {
          onPointerUp()
          return
        }
        if (
          Math.abs(deviation) < drawerContext().scrollThreshold() &&
          targetIsScrollable(target, direction === 'y' ? 'x' : 'y')
        ) {
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
        drawerContext().setIsTransitioning(false)
      })
    }

    let deviation: number
    switch (drawerContext().side()) {
      case 'top':
        deviation = -(dragStartPos - y)
        break
      case 'bottom':
        deviation = dragStartPos - y
        break
      case 'right':
        deviation = dragStartPos - x
        break
      case 'left':
        deviation = -(dragStartPos - x)
        break
    }
    deviation -= drawerContext().resolvedActiveSnapPoint().offset

    if (deviation > 0) deviation = drawerContext().dampFunction(deviation)

    const now = new Date()
    if (
      now.getTime() - cachedMoveTimestamp.getTime() >
      drawerContext().velocityCacheReset()
    ) {
      cachedMoveTimestamp = now
      cachedTranslate = drawerContext().translate()
    }

    drawerContext().setTranslate(-deviation)
  }

  const onPointerUp = () => {
    pointerDown = false
    pointerDownPos = null
    dragStartPos = null

    if (drawerContext().handleScrollableElements()) {
      if (drawerContext().isDragging()) {
        targetedScrollableElements.forEach(
          (targetedScrollableElement, index) => {
            targetedScrollableElement.style.overflow =
              originalScrollOverflows[index] ?? ''
            if (targetedScrollableElement.style.length === 0) {
              targetedScrollableElement.removeAttribute('style')
            }
          },
        )
      }
      targetedScrollableElements.length = 0
      originalScrollOverflows.length = 0
      originalScrollOffsets.length = 0
    }

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
      drawerContext().setIsTransitioning(true)
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
          drawerContext().setIsTransitioning(false)
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
          if (drawerContext().isClosing()) {
            dialogContext().setOpen(false)
          }
          drawerContext().setIsTransitioning(false)
        })
      }}
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      {...(otherProps as DialogContentProps<T>)}
    />
  )
}

export default DrawerContent
