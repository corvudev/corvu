import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  type Setter,
  splitProps,
  untrack,
  type ValidComponent,
} from 'solid-js'
import {
  createInternalResizableContext,
  createResizableContext,
} from '@src/context'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { fixToPrecision, resolveSize, splitPanels } from '@src/lib/utils'
import {
  getDistributablePercentage,
  resize as internalResize,
  resizePanel,
} from '@src/lib/resize'
import { isFunction, type Size } from '@corvu/utils'
import type { PanelData, PanelInstance, ResizeStrategy } from '@src/lib/types'
import { type Ref, sortByDocumentPosition } from '@corvu/utils/dom'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createOnce from '@corvu/utils/create/once'
import createSize from '@corvu/utils/create/size'
import { handleResizeConstraints } from '@src/lib/cursor'
import { mergeRefs } from '@corvu/utils/reactivity'

const DEFAULT_RESIZABLE_ROOT_ELEMENT = 'div'

export type ResizableRootCorvuProps = {
  /**
   * The orientation of the resizable.
   * @defaultValue 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Panel sizes in percentage.
   */
  sizes?: number[]
  /**
   * Callback fired when the panel sizes change.
   */
  onSizesChange?: (sizes: number[]) => void
  /**
   * Initial panel sizes. Gets overridden by the `initialSize` prop on `<Panel />` components.
   */
  initialSizes?: Size[]
  /**
   * The delta to use when resizing with arrow keys.
   * @defaultValue 0.1
   */
  keyboardDelta?: Size
  /**
   * Whether to handle the cursor style when resizing.
   * @defaultValue true
   */
  handleCursorStyle?: boolean
  /**
   * The `id` of the resizable context to use.
   */
  contextId?: string
}

export type ResizableRootSharedElementProps = {
  ref: Ref
  style: JSX.CSSProperties
  children: JSX.Element | ((props: ResizableRootChildrenProps) => JSX.Element)
}

export type ResizableRootElementProps = ResizableRootSharedElementProps & {
  'data-orientation': 'horizontal' | 'vertical'
  'data-corvu-resizable-root': ''
}

export type ResizableRootProps = ResizableRootCorvuProps &
  Partial<ResizableRootSharedElementProps>

export type ResizableRootChildrenProps = {
  /** The orientation of the resizable. */
  orientation: 'vertical' | 'horizontal'
  /** The sizes of the panels. */
  sizes: number[]
  /** Change the sizes of the panels. */
  setSizes: Setter<number[]>
  /** The delta to use when resizing with arrow keys. */
  keyboardDelta: Size
  /** Whether to handle the cursor style when resizing. */
  handleCursorStyle: boolean
  /** Resize a panel to a specific size with the given strategy. */
  resize: (panelIndex: number, size: Size, strategy?: ResizeStrategy) => void
  /** Collapse a panel with the given strategy. Only works if `collapsible` is set to `true`. */
  collapse: (panelIndex: number, strategy?: ResizeStrategy) => void
  /** Expand a panel with the given strategy. Only works if `collapsible` is set to `true`. */
  expand: (panelIndex: number, strategy?: ResizeStrategy) => void
}

/** Wrapper for the resizable.
 *
 * @data `data-corvu-resizable-root` - Present on every resizable root element.
 * @data `data-orientation` - The orientation of the resizable.
 */
const ResizableRoot = <
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_ROOT_ELEMENT,
>(
  props: DynamicProps<T, ResizableRootProps, ResizableRootElementProps>,
) => {
  const defaultedProps = mergeProps(
    {
      orientation: 'horizontal' as const,
      initialSizes: [],
      keyboardDelta: 0.1,
      handleCursorStyle: true,
    },
    props as ResizableRootProps,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'orientation',
    'sizes',
    'onSizesChange',
    'initialSizes',
    'keyboardDelta',
    'handleCursorStyle',
    'contextId',
    'ref',
    'style',
    'children',
  ])

  const [sizes, setSizes] = createControllableSignal<number[]>({
    value: () => localProps.sizes,
    initialValue: [],
    onChange: localProps.onSizesChange,
  })

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const rootSize = createSize({
    element: ref,
    dimension: () =>
      localProps.orientation === 'horizontal' ? 'width' : 'height',
  })

  const [panels, setPanels] = createSignal<PanelInstance[]>([])

  const sizesToIds: string[] = []

  const registerPanel = (panelData: PanelData) => {
    const _panels = panels()
    const panelIndex = _panels.filter(
      (panel) =>
        panelData.element.compareDocumentPosition(panel.data.element) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).length

    const idExists =
      sizesToIds[panelIndex] === undefined ||
      sizesToIds[panelIndex] === panelData.id
    const sizeExists = sizes()[panelIndex] !== undefined

    let panelSize: number | null = null
    if (panelData.initialSize !== undefined) {
      panelSize = resolveSize(panelData.initialSize, rootSize())
    } else if (localProps.initialSizes[panelIndex] !== undefined && idExists) {
      panelSize = resolveSize(localProps.initialSizes[panelIndex]!, rootSize())
    }

    panelSize = panelSize ?? 0.5

    setSizes((sizes) => {
      let newSizes = [...sizes]

      const previousTotalSize = newSizes.reduce(
        (totalSize, size) => totalSize + size,
        0,
      )
      if (((idExists && !sizeExists) || !idExists) && previousTotalSize === 1) {
        const offsetPerPanel = panelSize! / newSizes.length
        // TODO: Recognize min and max sizes
        newSizes = newSizes.map((size) => size - offsetPerPanel)
      }

      if (idExists) {
        if (!sizeExists) {
          newSizes[panelIndex] = panelSize!
        }
        sizesToIds[panelIndex] = panelData.id
      } else {
        newSizes.splice(panelIndex, 0, panelSize!)
        sizesToIds.splice(panelIndex, 0, panelData.id)
      }

      return newSizes
    })

    const panelSizeMemo = createMemo(() => {
      const index = sizesToIds.indexOf(panelData.id)
      return sizes()[index]!
    })

    createEffect(() => panelData.onResize?.(panelSizeMemo()))

    const panel: PanelInstance = {
      data: panelData,
      size: panelSizeMemo,
      resize: (size, strategy) =>
        resize(sizesToIds.indexOf(panelData.id), size, strategy),
      collapse: (strategy) =>
        collapse(sizesToIds.indexOf(panelData.id), strategy),
      expand: (strategy) => expand(sizesToIds.indexOf(panelData.id), strategy),
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
    const panelSizeIndex = sizesToIds.indexOf(id)
    sizesToIds.splice(panelSizeIndex, 1)
    setSizes((sizes) => {
      let newSizes = [...sizes]
      newSizes.splice(panelSizeIndex, 1)
      const totalSize = newSizes.reduce(
        (totalSize, size) => totalSize + size,
        0,
      )
      const offset = totalSize - 1
      const offsetPerPanel = offset / newSizes.length
      // TODO: Recognize min and max sizes
      newSizes = newSizes.map((size) => size + offsetPerPanel)
      return newSizes
    })
  }

  createEffect(() => {
    if (localProps.onSizesChange !== undefined) {
      localProps.onSizesChange(sizes())
    }
  })

  const resize = (
    panelIndex: number,
    size: Size,
    strategy?: ResizeStrategy,
  ) => {
    untrack(() => {
      const panel = panels()[panelIndex]
      if (!panel) return
      const minSize = resolveSize(panel.data.minSize ?? 0, rootSize())
      const maxSize = resolveSize(panel.data.maxSize ?? 1, rootSize())
      const newSize = resolveSize(size, rootSize())
      const allowedSize = Math.max(minSize, Math.min(newSize, maxSize))
      const deltaPercentage = allowedSize - sizes()[panelIndex]!

      resizePanel({
        initialSizes: panels().map((panel) => panel.size()),
        deltaPercentage,
        collapsible: false,
        strategy: strategy ?? 'both',
        panels: panels(),
        panel,
        resizableData: {
          rootSize: rootSize(),
          orientation: localProps.orientation,
          setSizes,
        },
      })
    })
  }

  const collapse = (panelIndex: number, strategy?: ResizeStrategy) => {
    untrack(() => {
      const panel = panels()[panelIndex]
      if (!panel) return

      const panelSize = sizes()[panelIndex]!
      const collapsedSize = resolveSize(
        panel.data.collapsedSize ?? 0,
        rootSize(),
      )
      if (!panel.data.collapsible || panelSize === collapsedSize) return
      const deltaPercentage = collapsedSize - panelSize
      resizePanel({
        initialSizes: panels().map((panel) => panel.size()),
        deltaPercentage,
        collapsible: true,
        strategy: strategy ?? 'both',
        panels: panels(),
        panel,
        resizableData: {
          rootSize: rootSize(),
          orientation: localProps.orientation,
          setSizes,
        },
      })
    })
  }

  const expand = (panelIndex: number, strategy?: ResizeStrategy) => {
    untrack(() => {
      const panel = panels()[panelIndex]
      if (!panel) return

      const panelSize = sizes()[panelIndex]!
      const collapsedSize = resolveSize(
        panel.data.collapsedSize ?? 0,
        rootSize(),
      )
      if (!panel.data.collapsible || panelSize !== collapsedSize) return
      const minSize = resolveSize(panel.data.minSize ?? 0, rootSize())
      const deltaPercentage = minSize - panelSize

      resizePanel({
        initialSizes: panels().map((panel) => panel.size()),
        deltaPercentage,
        collapsible: true,
        strategy: strategy ?? 'both',
        panels: panels(),
        panel,
        resizableData: {
          rootSize: rootSize(),
          orientation: localProps.orientation,
          setSizes,
        },
      })
    })
  }

  let initialSizes: number[] | null = null
  let altKeyCache = false

  const onDrag = (handle: HTMLElement, delta: number, altKey: boolean) => {
    if (initialSizes === null || altKeyCache !== altKey) {
      initialSizes = panels().map((panel) => panel.size())
      altKeyCache = altKey
    }
    if (altKey && panels().length > 2) {
      let panelIndex =
        panels().filter(
          (panel) =>
            handle.compareDocumentPosition(panel.data.element) &
            Node.DOCUMENT_POSITION_PRECEDING,
        ).length - 1
      const isPrecedingHandle = panelIndex === 0
      if (isPrecedingHandle) {
        panelIndex++
        delta = -delta
      }

      const panel = panels()[panelIndex]!
      const panelSize = initialSizes[panelIndex]!
      const deltaPercentage = delta / rootSize()
      const minDelta =
        resolveSize(panel.data.minSize ?? 0, rootSize()) - panelSize
      const maxDelta =
        resolveSize(panel.data.maxSize ?? 1, rootSize()) - panelSize
      const cappedDeltaPercentage =
        Math.max(minDelta, Math.min(deltaPercentage * 2, maxDelta)) / 2

      const [precedingPanels, followingPanels] = splitPanels({
        panels: panels(),
        focusedElement: panel.data.element,
      })
      const precedingPanelsIncluding = [...precedingPanels, panel]
      const followingPanelsIncluding = [panel, ...followingPanels]
      const distributablePercentage = getDistributablePercentage({
        desiredPercentage: cappedDeltaPercentage,
        initialSizes,
        collapsible: false,
        resizeActions: [
          {
            precedingPanels: precedingPanelsIncluding,
            followingPanels: followingPanels,
          },
          {
            precedingPanels: precedingPanels,
            followingPanels: followingPanelsIncluding,
            negate: true,
          },
        ],
        resizableData: {
          rootSize: rootSize(),
        },
      })

      if (localProps.handleCursorStyle === true) {
        handleResizeConstraints({
          orientation: localProps.orientation,
          desiredPercentage: deltaPercentage,
          distributablePercentage,
          revertConstraints: isPrecedingHandle,
        })
      }

      internalResize({
        initialSizes,
        collapsible: false,
        resizeActions: [
          {
            precedingPanels: precedingPanelsIncluding,
            followingPanels,
            deltaPercentage: distributablePercentage,
          },
          {
            precedingPanels,
            followingPanels: followingPanelsIncluding,
            deltaPercentage: -distributablePercentage,
          },
        ],
        resizableData: {
          rootSize: rootSize(),
          orientation: localProps.orientation,
          setSizes,
        },
      })
    } else {
      const [precedingPanels, followingPanels] = splitPanels({
        panels: panels(),
        focusedElement: handle,
      })

      const desiredPercentage = delta / rootSize()

      const distributablePercentage = getDistributablePercentage({
        desiredPercentage,
        initialSizes,
        collapsible: true,
        resizeActions: [
          {
            precedingPanels,
            followingPanels,
          },
        ],
        resizableData: {
          rootSize: rootSize(),
        },
      })

      internalResize({
        initialSizes,
        collapsible: true,
        resizeActions: [
          {
            precedingPanels,
            followingPanels,
            deltaPercentage: distributablePercentage,
          },
        ],
        resizableData: {
          rootSize: rootSize(),
          orientation: localProps.orientation,
          setSizes,
        },
      })

      if (localProps.handleCursorStyle === true) {
        const fixedDesiredPercentage = fixToPrecision(desiredPercentage)
        const fixedDistributablePercentage = fixToPrecision(
          distributablePercentage,
        )

        let betweenCollapse = false
        const precedingPanel = precedingPanels[precedingPanels.length - 1]!
        if (precedingPanel.data.collapsible) {
          const precedingCollapsedSize = resolveSize(
            precedingPanel.data.collapsedSize ?? 0,
            rootSize(),
          )
          if (
            (precedingPanel.size() === precedingCollapsedSize &&
              fixedDesiredPercentage > fixedDistributablePercentage) ||
            (precedingPanel.size() !== precedingCollapsedSize &&
              fixedDesiredPercentage < fixedDistributablePercentage)
          ) {
            betweenCollapse = true
          }
        }
        const followingPanel = followingPanels[0]!
        if (followingPanel.data.collapsible) {
          const followingCollapsedSize = resolveSize(
            followingPanel.data.collapsedSize ?? 0,
            rootSize(),
          )
          if (
            (followingPanel.size() === followingCollapsedSize &&
              fixedDesiredPercentage < fixedDistributablePercentage) ||
            (followingPanel.size() !== followingCollapsedSize &&
              fixedDesiredPercentage > fixedDistributablePercentage)
          ) {
            betweenCollapse = true
          }
        }

        handleResizeConstraints({
          orientation: localProps.orientation,
          desiredPercentage,
          distributablePercentage,
          betweenCollapse,
        })
      }
    }
  }

  const onKeyDown = (handle: HTMLElement, event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      const [precedingPanels, followingPanels] = splitPanels({
        panels: panels(),
        focusedElement: handle,
      })
      let collapsiblePanel = precedingPanels[precedingPanels.length - 1]
      if (!collapsiblePanel || !collapsiblePanel.data.collapsible) {
        collapsiblePanel = followingPanels[0]
        if (!collapsiblePanel || !collapsiblePanel.data.collapsible) return
      }
      const size = collapsiblePanel.size()
      const collapsedSize = resolveSize(
        collapsiblePanel.data.collapsedSize ?? 0,
        rootSize(),
      )
      if (size === collapsedSize) {
        collapsiblePanel.expand('following')
      } else {
        collapsiblePanel.collapse('following')
      }
      return
    }

    let deltaPercentage: number | null = null
    if (
      (localProps.orientation === 'horizontal' && event.key === 'ArrowLeft') ||
      (localProps.orientation === 'vertical' && event.key === 'ArrowUp') ||
      event.key === 'Home'
    ) {
      if (event.shiftKey || event.key === 'Home') {
        deltaPercentage = -1
      } else {
        deltaPercentage = -resolveSize(localProps.keyboardDelta, rootSize())
      }
    } else if (
      (localProps.orientation === 'horizontal' && event.key === 'ArrowRight') ||
      (localProps.orientation === 'vertical' && event.key === 'ArrowDown') ||
      event.key === 'End'
    ) {
      if (event.shiftKey || event.key === 'End') {
        deltaPercentage = 1
      } else {
        deltaPercentage = resolveSize(localProps.keyboardDelta, rootSize())
      }
    }

    if (deltaPercentage === null) return

    event.preventDefault()

    const [precedingPanels, followingPanels] = splitPanels({
      panels: panels(),
      focusedElement: handle,
    })

    const distributablePercentage = getDistributablePercentage({
      desiredPercentage: deltaPercentage,
      initialSizes: panels().map((panel) => panel.size()),
      collapsible: true,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
        },
      ],
      resizableData: {
        rootSize: rootSize(),
      },
    })

    internalResize({
      initialSizes: panels().map((panel) => panel.size()),
      collapsible: true,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
          deltaPercentage: distributablePercentage,
        },
      ],
      resizableData: {
        rootSize: rootSize(),
        orientation: localProps.orientation,
        setSizes,
      },
    })
  }

  const childrenProps: ResizableRootChildrenProps = {
    get sizes() {
      return sizes()
    },
    setSizes,
    get orientation() {
      return localProps.orientation
    },
    get keyboardDelta() {
      return localProps.keyboardDelta
    },
    get handleCursorStyle() {
      return localProps.handleCursorStyle
    },
    resize,
    collapse,
    expand,
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
          sizes,
          setSizes,
          orientation: () => localProps.orientation,
          keyboardDelta: () => localProps.keyboardDelta,
          handleCursorStyle: () => localProps.handleCursorStyle,
          resize,
          collapse,
          expand,
        }}
      >
        <InternalResizableContext.Provider
          value={{
            sizes,
            setSizes,
            orientation: () => localProps.orientation,
            keyboardDelta: () => localProps.keyboardDelta,
            handleCursorStyle: () => localProps.handleCursorStyle,
            rootSize,
            panels,
            registerPanel,
            unregisterPanel,
            onDrag,
            onDragEnd: () => (initialSizes = null),
            onKeyDown,
            resize,
            collapse,
            expand,
          }}
        >
          <Dynamic<ResizableRootElementProps>
            as={DEFAULT_RESIZABLE_ROOT_ELEMENT}
            // === SharedElementProps ===
            ref={mergeRefs(setRef, localProps.ref)}
            style={{
              display: 'flex',
              'flex-direction':
                localProps.orientation === 'horizontal' ? 'row' : 'column',
              ...localProps.style,
            }}
            // === ElementProps ===
            data-orientation={localProps.orientation}
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
