import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  onCleanup,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  type DragTarget,
  registerResizeHandle,
  type ResizeHandle,
  type ResizeHandleCallbacks,
  unregisterResizeHandle,
} from '@primitives/resizable/resizeHandleManager'
import Dynamic from '@lib/components/Dynamic'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import { mergeRefs } from '@lib/utils'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalResizableContext } from '@primitives/resizable/context'

export const DEFAULT_RESIZABLE_HANDLE_ELEMENT = 'button'

export type ResizableHandleProps<
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_HANDLE_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    onDrag: (event: Event) => void
    /**
     * The `id` of the resizable context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
    /** @hidden */
    children?: JSX.Element
  }
>

/** Resizable handle.
 *
 * @data `data-corvu-resizable-handle` - Present on every resizable handle.
 */
const ResizableHandle = <
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_HANDLE_ELEMENT,
>(
  props: ResizableHandleProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'onDrag',
    'contextId',
    'as',
    'ref',
    'style',
    'children',
  ])

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const [active, setActive] = createSignal(false)
  const [dragging, setDragging] = createSignal(false)
  const [startIntersection, setStartIntersection] =
    createSignal<ResizeHandle | null>(null)
  const [endIntersection, setEndIntersection] =
    createSignal<ResizeHandle | null>(null)

  const context = createMemo(() =>
    useInternalResizableContext(localProps.contextId),
  )

  let globalHandleCallbacks: ResizeHandleCallbacks | null = null

  createEffect(() => {
    const element = ref()
    if (!element) return

    const globalResizeHandle: ResizeHandle = {
      element,
      orientation: context().orientation(),
      startIntersection: {
        handle: startIntersection,
        setHandle: setStartIntersection,
      },
      endIntersection: {
        handle: endIntersection,
        setHandle: setEndIntersection,
      },
      dragging,
      setDragging,
      active,
      setActive,
      onDrag: (start: number, delta: number) => {
        context().onDrag(element, start, delta)
      },
      onDragEnd: context().onDragEnd,
    }

    globalHandleCallbacks = registerResizeHandle(globalResizeHandle)
    onCleanup(() => unregisterResizeHandle(globalResizeHandle))
  })

  return (
    <Dynamic
      as={localProps.as ?? (DEFAULT_RESIZABLE_HANDLE_ELEMENT as ValidComponent)}
      ref={mergeRefs(setRef, localProps.ref)}
      onPointerDown={(event: PointerEvent) => {
        const targetElement = event.target as HTMLElement
        let target: DragTarget = 'handle'
        if (
          targetElement.hasAttribute(
            'data-corvu-resizable-handle-start-intersection',
          )
        ) {
          target = 'startIntersection'
        }
        if (
          targetElement.hasAttribute(
            'data-corvu-resizable-handle-end-intersection',
          )
        ) {
          target = 'endIntersection'
        }
        globalHandleCallbacks?.onDragStart(event, target)
      }}
      onKeyDown={(event: KeyboardEvent) => {
        if (dragging()) return
        const element = ref()
        if (!element) return
        context().onKeyDown(element, event)
      }}
      style={{
        position: 'relative',
        ...localProps.style,
      }}
      {...otherProps}
    >
      <Show when={startIntersection()}>
        <div
          data-corvu-resizable-handle-start-intersection
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
          }}
        />
      </Show>
      {localProps.children}
      <Show when={endIntersection()}>
        <div
          data-corvu-resizable-handle-end-intersection
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
          }}
        />
      </Show>
    </Dynamic>
  )
}

export default ResizableHandle
