import {
  resolveSnapPoint,
  findClosestSnapPoint,
  shouldDrag,
  getScrollableParents,
} from '@lib/drawer'
import { dataIf } from '@lib/utils'
import DialogContent, {
  DialogContentProps,
} from '@primitives/dialog/DialogContent'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { useInternalDrawerContext } from '@primitives/drawer/DrawerContext'
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

  let dragStartPos: number

  // Values used to handle dragging on scrollable elements.
  let didMove = false
  let targetedScrollableElements: HTMLElement[] = []
  let originalScrollOverflows: string[] = []

  // Values used to calculate the velocity of the drawer when the user releases it.
  let cachedMoveTimestamp: Date
  let cachedTranslate = 0

  const drawerContext = createMemo(() =>
    useInternalDrawerContext(localProps.contextId),
  )
  const dialogContext = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  createEffect(() => {
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

  const onPointerDown = (event: PointerEvent) => {
    // Don't drag if the user wants to drag on an already scrolled element.
    if (
      !shouldDrag(
        event.target as HTMLElement,
        'ifScrolled',
        drawerContext().side(),
      )
    ) {
      return
    }

    if (drawerContext().isDragging()) return

    switch (drawerContext().side()) {
      case 'top':
      case 'bottom':
        dragStartPos = event.clientY
        break
      case 'right':
      case 'left':
        dragStartPos = event.clientX
    }

    if (drawerContext().handleScrollableElements()) {
      didMove = false
      targetedScrollableElements = []
      originalScrollOverflows = []
    }

    cachedMoveTimestamp = new Date()
    cachedTranslate = drawerContext().translate()

    batch(() => {
      drawerContext().setIsDragging(true)
      drawerContext().setIsTransitioning(false)
    })
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
    if (!drawerContext().isDragging()) return

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

    if (drawerContext().handleScrollableElements() && deviation !== 0) {
      // Don't drag if the user wants to drag upwards on a scrollable element.
      if (
        !didMove &&
        deviation > 0 &&
        !shouldDrag(target, 'ifScrollable', drawerContext().side())
      ) {
        onPointerUp()
        return
      }
      if (!didMove) {
        didMove = true
        targetedScrollableElements = getScrollableParents(target)
        targetedScrollableElements.forEach((targetedScrollableElement) => {
          originalScrollOverflows.push(
            targetedScrollableElement.style.overflow || '',
          )
          targetedScrollableElement.style.overflow = 'hidden'
        })
      }
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
    if (!drawerContext().isDragging()) return

    batch(() => {
      drawerContext().setIsTransitioning(true)
      drawerContext().setIsDragging(false)
    })

    if (drawerContext().handleScrollableElements()) {
      targetedScrollableElements.forEach((targetedScrollableElement, index) => {
        targetedScrollableElement.style.overflow =
          originalScrollOverflows[index] ?? ''
        if (targetedScrollableElement.style.length === 0) {
          targetedScrollableElement.removeAttribute('style')
        }
      })
    }

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
      drawerContext().setActiveSnapPoint(closestSnapPoint.value)
      if (closestSnapPoint.offset === drawerContext().drawerSize()) {
        dialogContext().setOpen(false)
      } else {
        drawerContext().setTranslate(closestSnapPoint.offset)
        setTimeout(
          () => {
            drawerContext().setIsTransitioning(false)
          },
          parseFloat(drawerContext().drawerStyles()!.transitionDuration) * 1000,
        )
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
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      {...(otherProps as DialogContentProps<T>)}
    />
  )
}

export default DrawerContent
