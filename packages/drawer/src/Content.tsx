import { type Axis, dataIf, type Side } from '@corvu/utils'
import {
  batch,
  type Component,
  createEffect,
  createMemo,
  type JSX,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type {
  ContentCorvuProps as DialogContentCorvuProps,
  ContentElementProps as DialogContentElementProps,
  ContentSharedElementProps as DialogContentSharedElementProps,
} from '@corvu/dialog'
import {
  findClosestSnapPoint,
  locationIsDraggable,
  resolveSnapPoint,
} from '@src/lib'
import { combineStyle } from '@corvu/utils/dom'
import Dialog from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { getScrollAtLocation } from '@corvu/utils/scroll'
import { useInternalDrawerContext } from '@src/context'

export type DrawerContentCorvuProps = DialogContentCorvuProps

export type DrawerContentSharedElementProps<T extends ValidComponent = 'div'> =
  DialogContentSharedElementProps<T>

export type DrawerContentElementProps = DrawerContentSharedElementProps & {
  onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent>
  onTouchStart: JSX.EventHandlerUnion<HTMLElement, TouchEvent>
  onTransitionEnd: JSX.EventHandlerUnion<HTMLElement, TransitionEvent>
  'data-side': Side
  'data-opening': '' | undefined
  'data-closing': '' | undefined
  'data-snapping': '' | undefined
  'data-transitioning': '' | undefined
  'data-resizing': '' | undefined
  'data-corvu-drawer-content': ''
} & DialogContentElementProps

export type DrawerContentProps<T extends ValidComponent = 'div'> =
  DrawerContentCorvuProps & Partial<DrawerContentSharedElementProps<T>>

/** Content of the drawer. Can be animated.
 *
 * @data `data-corvu-drawer-content` - Present on every drawer content element.
 * @data `data-open` - Present when the drawer is open.
 * @data `data-closed` - Present when the drawer is closed.
 * @data `data-side` - The side that the drawer attached on.
 * @data `data-opening` - Present when the drawer is in the open transition.
 * @data `data-closing` - Present when the drawer is in the close transition.
 * @data `data-snapping` - Present when the drawer is transitioning after the user stops dragging.
 * @data `data-transitioning` - Present when the drawer is transitioning (opening, closing or snapping).
 * @data `data-resizing` - Present when the drawer is transitioning after the size (width/height) changes. Only present if `transitionResize` is set to `true`.
 */
const DrawerContent = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, DrawerContentProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as DrawerContentProps, [
    'contextId',
    'style',
  ])

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
    Dialog.useContext(localProps.contextId),
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

  const transitionHeight = createMemo(() => {
    const transitionSize = drawerContext().transitionSize()
    if (transitionSize === null) return undefined

    switch (drawerContext().side()) {
      case 'top':
      case 'bottom':
        return `${transitionSize}px`
    }
    return undefined
  })

  const transitionWidth = createMemo(() => {
    const transitionSize = drawerContext().transitionSize()
    if (transitionSize === null) return undefined

    switch (drawerContext().side()) {
      case 'left':
      case 'right':
        return `${transitionSize}px`
    }
    return undefined
  })

  createEffect(() => {
    if (!dialogContext().open()) return

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('pointerup', onPointerUp)
    document.addEventListener('touchend', onTouchEnd)
    document.addEventListener('contextmenu', onUp)

    onCleanup(() => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('contextmenu', onUp)
    })
  })

  createEffect(() => {
    if (drawerContext().transitionState() === 'closing') {
      drawerContext().setIsDragging(false)
    }
  })

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    if (
      !locationIsDraggable(
        event.target as HTMLElement,
        dialogContext().contentRef()!,
        event.pointerType,
      )
    )
      return

    if (drawerContext().transitionState() === 'closing') return

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
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) {
        onUp()
        return
      }

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
          onUp()
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

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') onUp()
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length === 0) onUp()
  }

  const onUp = () => {
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
        const transitionDuration = parseFloat(
          drawerContext().drawerStyles()!.transitionDuration,
        )
        if (transitionDuration === 0) {
          drawerContext().setTransitionState(null)
        }
      }
    })
  }

  return (
    <Dialog.Content<
      Component<
        Omit<DrawerContentElementProps, keyof DialogContentElementProps>
      >
    >
      contextId={localProps.contextId}
      // === SharedElementProps ===
      style={combineStyle(
        {
          transform: transformValue(),
          'transition-duration': drawerContext().isDragging()
            ? '0ms'
            : undefined,
          height: transitionHeight(),
          width: transitionWidth(),
        },
        localProps.style,
      )}
      // === ElementProps ===
      onPointerDown={onPointerDown}
      onTouchStart={(e) => {
        if (e.touches.length !== 1) return
        dragStartPos = null
      }}
      onTransitionEnd={(e) => {
        if (e.target !== dialogContext().contentRef()) return
        batch(() => {
          if (drawerContext().transitionState() === 'closing') {
            drawerContext().closeDrawer()
          }
          if (drawerContext().transitionState() !== 'resizing') {
            drawerContext().setTransitionState(null)
          }
        })
      }}
      data-side={drawerContext().side()}
      data-opening={dataIf(drawerContext().transitionState() === 'opening')}
      data-closing={dataIf(drawerContext().transitionState() === 'closing')}
      data-snapping={dataIf(drawerContext().transitionState() === 'snapping')}
      data-transitioning={dataIf(drawerContext().isTransitioning())}
      data-resizing={dataIf(drawerContext().transitionState() === 'resizing')}
      data-corvu-drawer-content=""
      // === Misc ===
      data-corvu-dialog-content={null}
      {...otherProps}
    />
  )
}

export default DrawerContent
