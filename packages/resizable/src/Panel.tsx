import { combineStyle, type ElementOf, type Ref } from '@corvu/utils/dom'
import {
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  splitProps,
  untrack,
  type ValidComponent,
} from 'solid-js'
import { dataIf, isFunction, type Size } from '@corvu/utils'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import type { PanelInstance, ResizeStrategy } from '@src/lib/types'
import createOnce from '@corvu/utils/create/once'
import { createResizablePanelContext } from '@src/panelContext'
import { mergeRefs } from '@corvu/utils/reactivity'
import { resolveSize } from '@src/lib/utils'
import { useInternalResizableContext } from '@src/context'

export type ResizablePanelCorvuProps = {
  /**
   * The initial size of the panel. If the panel is rendered on the server, this should be a percentage to avoid layout shifts.
   */
  initialSize?: Size
  /**
   * The minimum size of the panel.
   * @defaultValue 0
   */
  minSize?: Size
  /**
   * The maximum size of the panel.
   * @defaultValue 1
   */
  maxSize?: Size
  /**
   * Whether the panel is collapsible.
   * @defaultValue `false`
   */
  collapsible?: boolean
  /**
   * The size the panel should collapse to.
   * @defaultValue 0
   */
  collapsedSize?: Size
  /**
   * How much the user has to "overdrag" for the panel to collapse.
   * @defaultValue 0.05
   */
  collapseThreshold?: Size
  /**
   * Callback fired when the panel is resized.
   * @param size - The new size of the panel.
   */
  onResize?: (size: number) => void
  /**
   * Callback fired when the panel is collapsed.
   * @param size - The new size of the panel.
   */
  onCollapse?: (size: number) => void
  /**
   * Callback fired when the panel is expanded.
   * @param size - The new size of the panel.
   */
  onExpand?: (size: number) => void
  /**
   * The `id` of the resizable context to use.
   */
  contextId?: string
  /**
   * The `id` attribute of the resizable panel element.
   * @defaultValue `createUniqueId()`
   */
  panelId?: string
}

export type ResizablePanelSharedElementProps<T extends ValidComponent = 'div'> =
  {
    ref: Ref<ElementOf<T>>
    style: string | JSX.CSSProperties
    children:
      | JSX.Element
      | ((props: ResizablePanelChildrenProps) => JSX.Element)
  }

export type ResizablePanelElementProps = ResizablePanelSharedElementProps & {
  id: string
  'data-collapsed': '' | undefined
  'data-expanded': '' | undefined
  'data-orientation': 'horizontal' | 'vertical'
  'data-corvu-resizable-panel': ''
}

export type ResizablePanelProps<T extends ValidComponent = 'div'> =
  ResizablePanelCorvuProps & Partial<ResizablePanelSharedElementProps<T>>

export type ResizablePanelChildrenProps = {
  /** The current size of the panel. */
  size: number
  /** The minimum size of the panel. */
  minSize: Size
  /** The maximum size of the panel. */
  maxSize: Size
  /** Whether the panel is collapsible. */
  collapsible: boolean
  /** The size the panel should collapse to. */
  collapsedSize: Size
  /** How much the user has to "overdrag" for the panel to collapse. */
  collapseThreshold: Size
  /** Whether the panel is currently collapsed. */
  collapsed: boolean
  /** Resize the panel to a specific size with the given strategy. */
  resize: (size: Size, strategy?: ResizeStrategy) => void
  /** Collapse the panel with the given strategy. Only works if `collapsible` is set to `true`. */
  collapse: (strategy?: ResizeStrategy) => void
  /** Expand the panel with the given strategy. Only works if `collapsible` is set to `true`. */
  expand: (strategy?: ResizeStrategy) => void
  /** The `id` attribute of the resizable panel element. */
  panelId: string
}

/** Resizable panel.
 *
 * @data `data-corvu-resizable-panel` - Present on every resizable panel.
 * @data `data-orientation` - The orientation of the resizable.
 * @data `data-collapsed` - Present if the panel is currently collapsed.
 * @data `data-expanded` - Present if the panel is currently expanded. Only present on panels that are collapsible.
 */
const ResizablePanel = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, ResizablePanelProps<T>>,
) => {
  const defaultedProps = mergeProps(
    {
      initialSize: 0.5,
      minSize: 0,
      maxSize: 1,
      collapsible: false,
      collapsedSize: 0,
      collapseThreshold: 0.05,
      panelId: createUniqueId(),
    },
    props as ResizablePanelProps,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'initialSize',
    'minSize',
    'maxSize',
    'collapsible',
    'collapsedSize',
    'collapseThreshold',
    'onResize',
    'onCollapse',
    'onExpand',
    'contextId',
    'panelId',
    'ref',
    'style',
    'children',
  ])

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const context = createMemo(() =>
    useInternalResizableContext(localProps.contextId),
  )

  const [panelInstance, setPanelInstance] = createSignal<PanelInstance | null>(
    null,
  )

  createEffect(() => {
    const element = ref()
    if (!element) return

    const _context = context()
    const instance = untrack(() => {
      return _context.registerPanel({
        id: localProps.panelId,
        element,
        initialSize: localProps.initialSize,
        minSize: localProps.minSize,
        maxSize: localProps.maxSize,
        collapsible: localProps.collapsible,
        collapsedSize: localProps.collapsedSize,
        collapseThreshold: localProps.collapseThreshold,
        onResize: localProps.onResize,
      })
    })
    setPanelInstance(instance)
    onCleanup(() => {
      _context.unregisterPanel(instance.data.id)
    })
  })

  const panelSize = () => {
    const instance = panelInstance()
    if (!instance) {
      if (typeof localProps.initialSize === 'number') {
        return localProps.initialSize
      }
      return 1
    }
    return instance.size()
  }

  const collapsed = createMemo((prev) => {
    const instance = panelInstance()
    if (localProps.collapsible !== true) {
      return false
    }
    const collapsed = instance
      ? instance.size() ===
        resolveSize(localProps.collapsedSize, context().rootSize())
      : false

    if (instance && prev !== collapsed) {
      if (collapsed && localProps.onCollapse !== undefined) {
        localProps.onCollapse(instance.size())
      } else if (!collapsed && localProps.onExpand !== undefined) {
        localProps.onExpand(instance.size())
      }
    }

    return collapsed
  })

  const resize = (size: Size, strategy?: ResizeStrategy) => {
    const instance = panelInstance()
    if (!instance) {
      // eslint-disable-next-line no-console
      console.warn(
        '[corvu] Cannot resize panel before it is mounted. Make sure to call `resize` after mount.',
      )
      return
    }
    instance.resize(size, strategy ?? 'both')
  }

  const collapse = (strategy?: ResizeStrategy) => {
    const instance = panelInstance()
    if (!instance) {
      // eslint-disable-next-line no-console
      console.warn(
        '[corvu] Cannot collapse panel before it is mounted. Make sure to call `collapse` after mount.',
      )
      return
    }
    instance.collapse(strategy ?? 'both')
  }

  const expand = (strategy?: ResizeStrategy) => {
    const instance = panelInstance()
    if (!instance) {
      // eslint-disable-next-line no-console
      console.warn(
        '[corvu] Cannot expand panel before it is mounted. Make sure to call `expand` after mount.',
      )
      return
    }
    instance.expand(strategy ?? 'both')
  }

  const childrenProps: ResizablePanelChildrenProps = {
    get size() {
      return panelSize()
    },
    get minSize() {
      return localProps.minSize
    },
    get maxSize() {
      return localProps.maxSize
    },
    get collapsible() {
      return localProps.collapsible
    },
    get collapsedSize() {
      return localProps.collapsedSize
    },
    get collapseThreshold() {
      return localProps.collapseThreshold
    },
    get collapsed() {
      return collapsed()
    },
    resize,
    collapse,
    expand,
    get panelId() {
      return localProps.panelId
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

  const memoizedResizablePanel = createMemo(() => {
    const ResizablePanelContext = createResizablePanelContext(
      localProps.contextId,
    )

    return (
      <ResizablePanelContext.Provider
        value={{
          size: panelSize,
          minSize: () => localProps.minSize,
          maxSize: () => localProps.maxSize,
          collapsible: () => localProps.collapsible,
          collapsedSize: () => localProps.collapsedSize,
          collapseThreshold: () => localProps.collapseThreshold,
          collapsed,
          resize,
          collapse,
          expand,
          panelId: () => localProps.panelId,
        }}
      >
        <Dynamic<ResizablePanelElementProps>
          as="div"
          // === SharedElementProps ===
          ref={mergeRefs(setRef, localProps.ref)}
          style={combineStyle(
            {
              'flex-basis': panelSize() * 100 + '%',
            },
            localProps.style,
          )}
          // === ElementProps ===
          id={localProps.panelId}
          data-collapsed={dataIf(collapsed())}
          data-expanded={dataIf(
            localProps.collapsible === true && !collapsed(),
          )}
          data-orientation={context().orientation()}
          data-corvu-resizable-panel=""
          {...otherProps}
        >
          {untrack(() => resolveChildren())}
        </Dynamic>
      </ResizablePanelContext.Provider>
    )
  })

  return memoizedResizablePanel as unknown as JSX.Element
}

export default ResizablePanel
