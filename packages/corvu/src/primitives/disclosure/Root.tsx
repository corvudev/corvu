import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  on,
  type Setter,
  untrack,
} from 'solid-js'
import {
  createDisclosureContext,
  createInternalDisclosureContext,
} from '@primitives/disclosure/context'
import createControllableSignal from '@lib/create/controllableSignal'
import createOnce from '@lib/create/once'
import createPresence from '@lib/create/presence'
import { isFunction } from '@lib/assertions'

export type DisclosureRootProps = {
  /**
   * Whether the disclosure is expanded.
   */
  expanded?: boolean
  /**
   * Callback fired when the expanded state changes.
   */
  onExpandedChange?: (expanded: boolean) => void
  /**
   * Whether the disclosure is expanded initially.
   * @defaultValue `false`
   */
  initialExpanded?: boolean
  /**
   * Whether the disclosure content should be removed or hidden when collapsed. Useful if you want to always render the content for SEO reasons.
   * @defaultValue `remove`
   */
  collapseBehavior?: 'remove' | 'hide'
  /**
   * The `id` attribute of the disclosure content element.
   * @defaultValue A unique id
   */
  disclosureId?: string
  /**
   * The `id` of the disclosure context. Useful if you have nested disclosures and want to create components that belong to a disclosure higher up in the tree.
   */
  contextId?: string
  children: JSX.Element | ((props: DisclosureRootChildrenProps) => JSX.Element)
}

/** Props that are passed to the Root component children callback. */
export type DisclosureRootChildrenProps = {
  /** Whether the disclosure is expanded. */
  expanded: boolean
  /** Callback fired when the expanded state changes. */
  setExpanded: Setter<boolean>
  /** Whether the disclosure content should be removed or hidden when collapsed. */
  collapseBehavior: 'remove' | 'hide'
  /** The `id` attribute of the disclosure content element. */
  disclosureId: string
  /** Whether the disclosure content is present. This differes from `expanded` as it tracks pending animations. */
  contentPresent: boolean
  /** The disclosure content element. */
  contentRef: HTMLElement | null
  /** The current size of the disclosure content. Useful if you want to animate width or height. `[width, height]` */
  contentSize: [number, number] | null
}

/** Context wrapper for the disclosure. Is required for every disclosure you create. */
const DisclosureRoot: Component<DisclosureRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      initialExpanded: false,
      collapseBehavior: 'remove' as const,
      disclosureId: createUniqueId(),
    },
    props,
  )

  const [expanded, setExpanded] = createControllableSignal({
    value: () => defaultedProps.expanded,
    initialValue: defaultedProps.initialExpanded,
    onChange: defaultedProps.onExpandedChange,
  })

  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)

  const [contentSize, setContentSize] = createSignal<[number, number] | null>(
    null,
  )

  // Updates the content size on every expanded change.
  createEffect(
    on([contentRef, expanded], ([element]) => {
      if (!element) {
        setContentSize(null)
        return
      }

      untrack(() => {
        const originalStyles = {
          animationName: element.style.animationName,
        }

        element.style.animationName = 'none'

        const width = element.offsetWidth
        const height = element.offsetHeight

        const currentSize = contentSize()

        if (
          currentSize === null ||
          width !== currentSize[0] ||
          height !== currentSize[1]
        ) {
          setContentSize([element.offsetWidth, element.offsetHeight])
        }

        element.style.animationName = originalStyles.animationName
      })
    }),
  )

  const { present: contentPresent } = createPresence({
    show: expanded,
    element: contentRef,
  })

  const childrenProps: DisclosureRootChildrenProps = {
    get expanded() {
      return expanded()
    },
    setExpanded,
    get collapseBehavior() {
      return defaultedProps.collapseBehavior
    },
    get disclosureId() {
      return defaultedProps.disclosureId
    },
    get contentPresent() {
      return contentPresent()
    },
    get contentRef() {
      return contentRef()
    },
    get contentSize() {
      return contentSize()
    },
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  const memoizedDisclosureRoot = createMemo(() => {
    const DisclosureContext = createDisclosureContext(defaultedProps.contextId)
    const InternalDisclosureContext = createInternalDisclosureContext(
      defaultedProps.contextId,
    )

    return (
      <DisclosureContext.Provider
        value={{
          expanded,
          setExpanded,
          collapseBehavior: () => defaultedProps.collapseBehavior,
          disclosureId: () => defaultedProps.disclosureId,
          contentPresent,
          contentRef,
          contentSize,
        }}
      >
        <InternalDisclosureContext.Provider
          value={{
            expanded,
            setExpanded,
            collapseBehavior: () => defaultedProps.collapseBehavior,
            disclosureId: () => defaultedProps.disclosureId,
            contentPresent,
            contentRef,
            setContentRef,
            contentSize,
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalDisclosureContext.Provider>
      </DisclosureContext.Provider>
    )
  })

  return memoizedDisclosureRoot as unknown as JSX.Element
}

export default DisclosureRoot
