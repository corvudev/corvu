import {
  type Accessor,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  onCleanup,
  type Setter,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type { OverrideComponentProps, Size } from '@lib/types'
import Dynamic from '@lib/components/Dynamic'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import { mergeRefs } from '@lib/utils'
import { useInternalResizableContext } from '@primitives/resizable/context'

export const DEFAULT_RESIZABLE_PANEL_ELEMENT = 'div'

export type ResizablePanelProps<
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_PANEL_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    initialSize?: Size
    minSize?: Size
    maxSize?: Size
    collapsible?: boolean
    collapsibleSize?: Size
    collapseThreshold?: number
    onCollapse?: () => void
    onExpand?: () => void
    panelId?: string
    /**
     * The `id` of the resizable context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>
export type PanelData = {
  id: string
  element: HTMLElement
  initialSize?: number
  minSize?: Size
  maxSize?: Size
  collapsible: boolean
  collapsibleSize?: Size
  onCollapse?: () => void
  onExpand?: () => void
  onResize?: (size: Size) => void
}

export type PanelInstance = {
  data: PanelData
  size: Accessor<number>
  setSize: Setter<number>
}

/** Resizable panel.
 *
 * @data `data-corvu-resizable-panel` - Present on every resizable panel.
 */
const ResizablePanel = <
  T extends ValidComponent = typeof DEFAULT_RESIZABLE_PANEL_ELEMENT,
>(
  props: ResizablePanelProps<T>,
) => {
  const defaultedProps = mergeProps(props, {
    collapsible: false,
    panelId: createUniqueId(),
  })
  const [localProps, otherProps] = splitProps(defaultedProps, [
    'initialSize',
    'minSize',
    'maxSize',
    'collapsible',
    'collapsibleSize',
    'onCollapse',
    'onExpand',
    'panelId',
    'contextId',
    'as',
    'ref',
    'style',
  ])

  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const context = createMemo(() =>
    useInternalResizableContext(localProps.contextId),
  )

  const panelInstance = createMemo(() => {
    const element = ref()
    if (!element) return
    const _context = context()
    const instance = _context.registerPanel({
      id: localProps.panelId,
      element,
      initialSize: localProps.initialSize,
      minSize: localProps.minSize,
      maxSize: localProps.maxSize,
      collapsible: localProps.collapsible,
      collapsibleSize: localProps.collapsibleSize,
      onCollapse: localProps.onCollapse,
      onExpand: localProps.onExpand,
    })
    onCleanup(() => {
      _context.unregisterPanel(instance.data.id)
    })
    return instance
  })

  const panelSize = () => {
    const instance = panelInstance()
    if (!instance) {
      if (typeof localProps.initialSize === 'number') {
        return localProps.initialSize * 100 + '%'
      }
      return '100%'
    }
    return instance.size() * 100 + '%'
  }

  createEffect(() => {
    console.log('panelSize', panelSize())
  })

  return (
    <Dynamic
      as={localProps.as ?? (DEFAULT_RESIZABLE_PANEL_ELEMENT as ValidComponent)}
      ref={mergeRefs(setRef, localProps.ref)}
      style={{
        'flex-basis': panelSize(),
        ...localProps.style,
      }}
      data-corvu-resizable-panel=""
      {...otherProps}
    />
  )
}

export default ResizablePanel
