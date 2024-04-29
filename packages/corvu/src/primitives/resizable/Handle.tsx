import { callEventHandler, dataIf, mergeRefs } from '@lib/utils'
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
} from '@primitives/resizable/lib/types'
import {
  fixToPrecision,
  resolveSize,
  splitPanels,
} from '@primitives/resizable/lib/utils'
import {
  registerHandle,
  unregisterHandle,
} from '@primitives/resizable/lib/handleManager'
import Dynamic from '@lib/components/Dynamic'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalResizableContext } from '@primitives/resizable/context'

export const DEFAULT_RESIZABLE_HANDLE_ELEMENT = 'button'

export type ResizableHandleProps<
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_HANDLE_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
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
    onDragEnd?: (event: PointerEvent) => void
    /**
     * The `id` of the resizable context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
    /** @hidden */
    disabled?: boolean
    /** @hidden */
    children?: JSX.Element
    /** @hidden */
    onMouseEnter?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
    /** @hidden */
    onMouseLeave?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
    /** @hidden */
    onKeyDown?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    /** @hidden */
    onKeyUp?: JSX.EventHandlerUnion<HTMLElement, KeyboardEvent>
    /** @hidden */
    onFocus?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
    /** @hidden */
    onBlur?: JSX.EventHandlerUnion<HTMLElement, FocusEvent>
    /** @hidden */
    onPointerDown?: JSX.EventHandlerUnion<HTMLElement, PointerEvent>
  }
>

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
  props: ResizableHandleProps<T>,
) => {
  const defaultedProps = mergeProps(
    {
      startIntersection: true,
      endIntersection: true,
      altKey: true,
    },
    props,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'startIntersection',
    'endIntersection',
    'altKey',
    'onDragStart',
    'onDrag',
    'onDragEnd',
    'contextId',
    'as',
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
          localProps.onDrag?.(dragEvent)
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
    <Dynamic
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_RESIZABLE_HANDLE_ELEMENT
      }
      ref={mergeRefs(setRef, localProps.ref)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onFocus={onFocus}
      onBlur={onBlur}
      onPointerDown={onPointerDown}
      role="separator"
      aria-controls={ariaInformation()?.ariaControls}
      aria-orientation={context().orientation()}
      aria-valuenow={ariaInformation()?.ariaValueNow}
      aria-valuemin={ariaInformation()?.ariaValueMin}
      aria-valuemax={ariaInformation()?.ariaValueMax}
      data-corvu-resizable-handle=""
      data-active={dataIf(active())}
      data-dragging={dataIf(dragging())}
      data-orientation={context().orientation()}
      style={{
        position: 'relative',
        cursor: context().handleCursorStyle() ? 'inherit' : undefined,
        'touch-action': 'none',
        'flex-shrink': 0,
        ...localProps.style,
      }}
      disabled={localProps.disabled}
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
