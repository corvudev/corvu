import { callEventHandler, type Ref } from '@corvu/utils/dom'
import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  on,
  onCleanup,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type {
  DragTarget,
  Handle,
  HandleCallbacks,
  HoverState,
} from '@src/lib/types'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { fixToPrecision, resolveSize, splitPanels } from '@src/lib/utils'
import { registerHandle, unregisterHandle } from '@src/lib/handleManager'
import { dataIf } from '@corvu/utils'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalResizableContext } from '@src/context'

export const DEFAULT_RESIZABLE_HANDLE_ELEMENT = 'button'

export type ResizableHandleCorvuProps = {
  /**
   * Whether the handle is allowed to intersect with another handle at its start (Left/Top of the handle)
   * @defaultValue `true`
   */
  startIntersection?: boolean
  /**
   * Whether the handle is allowed to intersect with another handle at its end (Right/Bottom of the handle)
   * @defaultValue `true`
   */
  endIntersection?: boolean
  /**
   * Whether Alt key resize mode is enabled. Set to `'only'` to make it the default  and only way to resize.
   * @defaultValue `true`
   */
  altKey?: boolean | 'only'
  /**
   * Callback fired when the handle starts being dragged. Can be prevented by calling `event.preventDefault`.
   */
  onDragStart?: (event: PointerEvent) => void
  /**
   * Callback fired when the handle is being dragged. Can be prevented by calling `event.preventDefault`.
   */
  onDrag?: (event: CustomEvent) => void
  /**
   * Callback fired when the handle stops being dragged.
   */
  onDragEnd?: (event: PointerEvent | TouchEvent | MouseEvent) => void
  /**
   * The `id` of the resizable context to use.
   */
  contextId?: string
}

export type ResizableHandleSharedElementProps = {
  ref: Ref
  style: JSX.CSSProperties
  disabled: boolean | undefined
  onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
  onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
  onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
  onKeyUp: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
  onMouseEnter: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
  onMouseLeave: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
  onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent>
  children: JSX.Element
}

export type ResizableHandleElementProps = ResizableHandleSharedElementProps & {
  role: 'separator'
  'aria-controls': string | undefined
  'aria-orientation': 'horizontal' | 'vertical'
  'aria-valuemax': number | undefined
  'aria-valuemin': number | undefined
  'aria-valuenow': number | undefined
  'data-active': '' | undefined
  'data-dragging': '' | undefined
  'data-orientation': 'horizontal' | 'vertical'
  'data-corvu-resizable-handle': ''
}

export type ResizableHandleProps = ResizableHandleCorvuProps &
  Partial<ResizableHandleSharedElementProps>

/** Resizable handle.
 *
 * @data `data-corvu-resizable-handle` - Present on every resizable handle.
 * @data `data-active` - Present when the handle is active.
 * @data `data-dragging` - Present when the handle is being dragged.
 * @data `data-orientation` - The orientation of the resizable.
 */
const ResizableHandle = <
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_HANDLE_ELEMENT,
>(
  props: DynamicProps<T, ResizableHandleProps, ResizableHandleElementProps>,
) => {
  const defaultedProps = mergeProps(
    {
      startIntersection: true,
      endIntersection: true,
      altKey: true,
    },
    props as ResizableHandleProps,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'startIntersection',
    'endIntersection',
    'altKey',
    'onDragStart',
    'onDrag',
    'onDragEnd',
    'contextId',
    'ref',
    'style',
    'disabled',
    'children',
    'onMouseEnter',
    'onMouseLeave',
    'onKeyDown',
    'onKeyUp',
    'onFocus',
    'onBlur',
    'onPointerDown',
  ])

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const [hoveredAsIntersection, setHoveredAsIntersection] = createSignal(false)
  const [hovered, setHovered] = createSignal<HoverState>(null)
  const [focused, setFocused] = createSignal(false)

  const [active, setActive] = createSignal(false)
  const [dragging, setDragging] = createSignal(false)

  const [startIntersection, setStartIntersection] = createSignal<Handle | null>(
    null,
  )
  const [endIntersection, setEndIntersection] = createSignal<Handle | null>(
    null,
  )

  const context = createMemo(() =>
    useInternalResizableContext(localProps.contextId),
  )

  const ariaInformation = createMemo(() => {
    const handle = ref()
    if (!handle) {
      return undefined
    }
    const panels = context().panels()
    const [precidingPanels, followingPanels] = splitPanels({
      panels,
      focusedElement: handle,
    })
    const ariaControls = precidingPanels[precidingPanels.length - 1]?.data.id
    const ariaValueMax = followingPanels.reduce(
      // eslint-disable-next-line solid/reactivity
      (acc, panel) =>
        acc - resolveSize(panel.data.minSize ?? 0, context().rootSize()),
      1,
    )
    const ariaValueMin = precidingPanels.reduce(
      // eslint-disable-next-line solid/reactivity
      (acc, panel) =>
        acc + resolveSize(panel.data.minSize ?? 0, context().rootSize()),
      0,
    )
    const ariaValueNow = precidingPanels.reduce(
      // eslint-disable-next-line solid/reactivity
      (acc, panel) => acc + resolveSize(panel.size(), context().rootSize()),
      0,
    )

    return {
      ariaControls,
      ariaValueMax: fixToPrecision(ariaValueMax),
      ariaValueMin: fixToPrecision(ariaValueMin),
      ariaValueNow: fixToPrecision(ariaValueNow),
    }
  })

  let globalHandleCallbacks: HandleCallbacks | null = null

  createEffect(() => {
    if (localProps.disabled === true) return
    const element = ref()
    if (!element) return

    const globalHandle: Handle = {
      element,
      orientation: context().orientation(),
      handleCursorStyle: context().handleCursorStyle,
      altKey: localProps.altKey,
      startIntersection: {
        handle: startIntersection,
        setHandle: (handle) => {
          if (localProps.startIntersection !== true) return
          setStartIntersection(handle)
        },
      },
      endIntersection: {
        handle: endIntersection,
        setHandle: (handle) => {
          if (localProps.endIntersection !== true) return
          setEndIntersection(handle)
        },
      },
      hovered,
      focused,
      hoveredAsIntersection,
      setHoveredAsIntersection,
      active,
      setActive,
      dragging,
      setDragging,
      onDrag: (delta: number, altKey: boolean) => {
        if (localProps.onDrag !== undefined) {
          const dragEvent = new CustomEvent('drag', {
            cancelable: true,
          })
          localProps.onDrag(dragEvent)
          if (dragEvent.defaultPrevented) return
        }
        context().onDrag(element, delta, altKey)
      },
      onDragEnd: (event) => {
        localProps.onDragEnd?.(event)
        context().onDragEnd()
      },
    }

    globalHandleCallbacks = registerHandle(globalHandle)
    onCleanup(() => {
      unregisterHandle(globalHandle)
      globalHandleCallbacks = null
    })
  })

  createEffect(
    on(hovered, () => {
      globalHandleCallbacks?.onHoveredChange(hovered())
    }),
  )

  const onMouseEnter: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    if (
      callEventHandler(localProps.onMouseEnter, e) ||
      localProps.disabled === true
    )
      return
    setHovered('handle')
  }
  const onMouseLeave: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    if (callEventHandler(localProps.onMouseLeave, e)) return
    setHovered(null)
  }
  const onKeyDown: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
    if (callEventHandler(localProps.onKeyDown, e) || dragging()) return
    const element = ref()
    if (!element) return
    context().onKeyDown(element, e)
  }
  const onKeyUp: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent> = (e) => {
    if (callEventHandler(localProps.onKeyUp, e) || e.key !== 'Tab') return
    setFocused(true)
  }
  const onFocus: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
    if (callEventHandler(localProps.onFocus, e) || hovered()) return
    setFocused(true)
    setActive(true)
  }
  const onBlur: JSX.EventHandlerUnion<HTMLElement, FocusEvent> = (e) => {
    if (callEventHandler(localProps.onBlur, e)) return
    setFocused(false)
    if (hovered()) return
    setActive(false)
  }
  const onPointerDown: JSX.EventHandlerUnion<HTMLElement, PointerEvent> = (
    e,
  ) => {
    if (callEventHandler(localProps.onPointerDown, e)) return
    if (callEventHandler(localProps.onDragStart, e)) return
    const targetElement = e.target as HTMLElement
    let target: DragTarget = 'handle'
    if (
      targetElement.hasAttribute(
        'data-corvu-resizable-handle-start-intersection',
      )
    ) {
      target = 'startIntersection'
    }
    if (
      targetElement.hasAttribute('data-corvu-resizable-handle-end-intersection')
    ) {
      target = 'endIntersection'
    }
    globalHandleCallbacks?.onDragStart(e, target)
  }

  return (
    <Dynamic<ResizableHandleElementProps>
      as={DEFAULT_RESIZABLE_HANDLE_ELEMENT}
      // === SharedElementProps ===
      ref={mergeRefs(setRef, localProps.ref)}
      style={{
        position: 'relative',
        cursor: context().handleCursorStyle() ? 'inherit' : undefined,
        'touch-action': 'none',
        'flex-shrink': 0,
        ...localProps.style,
      }}
      disabled={localProps.disabled}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPointerDown={onPointerDown}
      // === ElementProps ===
      role="separator"
      aria-controls={ariaInformation()?.ariaControls}
      aria-orientation={context().orientation()}
      aria-valuemax={ariaInformation()?.ariaValueMax}
      aria-valuemin={ariaInformation()?.ariaValueMin}
      aria-valuenow={ariaInformation()?.ariaValueNow}
      data-active={dataIf(active())}
      data-dragging={dataIf(dragging())}
      data-orientation={context().orientation()}
      data-corvu-resizable-handle=""
      {...otherProps}
    >
      <Show when={startIntersection()}>
        <div
          data-corvu-resizable-handle-start-intersection
          onMouseEnter={() => setHovered('startIntersection')}
          onMouseLeave={(e) => {
            if (ref()?.contains(e.relatedTarget as HTMLElement) === true) {
              setHovered('handle')
            } else {
              setHovered(null)
            }
          }}
          style={{
            position: 'absolute',
            'aspect-ratio': '1 / 1',
            top: 0,
            left: 0,
            height:
              context().orientation() === 'horizontal' ? undefined : '100%',
            width:
              context().orientation() === 'horizontal' ? '100%' : undefined,
            transform:
              context().orientation() === 'horizontal'
                ? 'translate3d(0, -100%, 0)'
                : 'translate3d(-100%, 0, 0)',
            'z-index': 1,
          }}
        />
      </Show>
      {localProps.children}
      <Show when={endIntersection()}>
        <div
          data-corvu-resizable-handle-end-intersection
          onMouseEnter={() => setHovered('endIntersection')}
          onMouseLeave={(e) => {
            if (ref()?.contains(e.relatedTarget as HTMLElement) === true) {
              setHovered('handle')
            } else {
              setHovered(null)
            }
          }}
          style={{
            position: 'absolute',
            'aspect-ratio': '1 / 1',
            bottom: 0,
            right: 0,
            height:
              context().orientation() === 'horizontal' ? undefined : '100%',
            width:
              context().orientation() === 'horizontal' ? '100%' : undefined,
            transform:
              context().orientation() === 'horizontal'
                ? 'translate3d(0, 100%, 0)'
                : 'translate3d(100%, 0, 0)',
            'z-index': 1,
          }}
        />
      </Show>
    </Dynamic>
  )
}

export default ResizableHandle
