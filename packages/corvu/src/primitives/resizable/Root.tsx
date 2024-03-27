import {
  type Component,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  splitProps,
  untrack,
  type ValidComponent,
} from 'solid-js'
import {
  createInternalResizableContext,
  createResizableContext,
} from '@primitives/resizable/context'
import { mergeRefs, sortByDocumentPosition } from '@lib/utils'
import type { OverrideComponentProps, Size } from '@lib/types'
import type { PanelData, PanelInstance } from '@primitives/resizable/Panel'
import createOnce from '@lib/create/once'
import createSize from '@lib/create/size'
import Dynamic from '@lib/components/Dynamic'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import { isFunction } from '@lib/assertions'
import { resizePanels } from '@primitives/resizable/lib'

const DEFAULT_RESIZABLE_ROOT_ELEMENT = 'div'

export type ResizableRootProps<
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_ROOT_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    orientation?: 'vertical' | 'horizontal'
    keyboardDelta?: number
    /**
     * The `id` of the resizable context to use.
     */
    contextId?: string
    children: JSX.Element | ((props: ResizableRootChildrenProps) => JSX.Element)
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

export type ResizableRootChildrenProps = {
  orientation: 'vertical' | 'horizontal'
}

const ResizableRoot: Component<ResizableRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      orientation: 'horizontal' as const,
      keyboardDelta: 10,
    },
    props,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'orientation',
    'keyboardDelta',
    'contextId',
    'as',
    'ref',
    'style',
    'children',
  ])

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const resizableSize = createSize({
    element: ref,
    dimension: localProps.orientation === 'horizontal' ? 'width' : 'height',
  })

  const [panels, setPanels] = createSignal<PanelInstance[]>([])
  const registerPanel = (panelData: PanelData) => {
    const [size, setSize] = createSignal(
      panelData.initialSize ? resolveSize(panelData.initialSize) : 1,
    )
    const panel: PanelInstance = {
      data: panelData,
      size,
      setSize,
    }
    setPanels((panels) => {
      const newPanels = [...panels]
      newPanels.push(panel)
      newPanels.sort((a, b) =>
        sortByDocumentPosition(a.data.element, b.data.element),
      )
      return newPanels
    })
    return panel
  }
  const unregisterPanel = (id: string) => {
    setPanels((panels) => panels.filter((panel) => panel.data.id !== id))
  }

  let originalSizes: number[] | null = null

  const onDrag = (handle: HTMLElement, delta: number) => {
    if (originalSizes === null) {
      originalSizes = panels().map((panel) => panel.size())
    }

    resizePanels({
      delta,
      handle,
      panels: panels(),
      originalSizes,
      resizableSize: resizableSize(),
    })
  }

  const onDragEnd = () => {
    originalSizes = null
  }

  const onKeyDown = (handle: HTMLElement, event: KeyboardEvent) => {
    let delta: number | null = null
    if (
      defaultedProps.orientation === 'horizontal' &&
      event.key === 'ArrowLeft'
    ) {
      delta = -defaultedProps.keyboardDelta
    } else if (
      defaultedProps.orientation === 'horizontal' &&
      event.key === 'ArrowRight'
    ) {
      delta = defaultedProps.keyboardDelta
    } else if (
      defaultedProps.orientation === 'vertical' &&
      event.key === 'ArrowUp'
    ) {
      delta = -defaultedProps.keyboardDelta
    } else if (
      defaultedProps.orientation === 'vertical' &&
      event.key === 'ArrowDown'
    ) {
      delta = defaultedProps.keyboardDelta
    }
    if (delta !== null) {
      event.preventDefault()
      resizePanels({
        delta,
        handle,
        panels: panels(),
        originalSizes: panels().map((panel) => panel.size()),
        resizableSize: resizableSize(),
      })
    }
  }

  const resolveSize = (size: Size) => {
    if (typeof size === 'number') {
      return size
    }
    if (!size.endsWith('px')) {
      throw new Error(
        `[corvu] Sizes must be a number or a string ending with 'px'. Got ${size}`,
      )
    }
    return parseFloat(size) / resizableSize()
  }

  const childrenProps: ResizableRootChildrenProps = {
    get orientation() {
      return localProps.orientation
    },
  }

  const memoizedChildren = createOnce(() => localProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  const memoizedResizableRoot = createMemo(() => {
    const ResizableContext = createResizableContext(localProps.contextId)
    const InternalResizableContext = createInternalResizableContext(
      localProps.contextId,
    )

    return (
      <ResizableContext.Provider
        value={{
          orientation: () => localProps.orientation,
        }}
      >
        <InternalResizableContext.Provider
          value={{
            orientation: () => localProps.orientation,
            registerPanel,
            unregisterPanel,
            onDrag,
            onDragEnd,
            onKeyDown,
          }}
        >
          <Dynamic
            as={localProps.as ?? DEFAULT_RESIZABLE_ROOT_ELEMENT}
            ref={mergeRefs(setRef, localProps.ref)}
            style={{
              display: 'flex',
              'flex-direction':
                localProps.orientation === 'horizontal' ? 'row' : 'column',
              ...localProps.style,
            }}
            data-corvu-resizable-root=""
            {...otherProps}
          >
            {untrack(() => resolveChildren())}
          </Dynamic>
        </InternalResizableContext.Provider>
      </ResizableContext.Provider>
    )
  })

  return memoizedResizableRoot as unknown as JSX.Element
}

export default ResizableRoot
