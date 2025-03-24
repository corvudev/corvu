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
} from '@src/context'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createOnce from '@corvu/utils/create/once'
import createPresence from 'solid-presence'
import { isFunction } from '@corvu/utils'

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
   * Whether the initial open animation of the disclosure content should be prevented.
   * @defaultValue `false`
   */
  preventInitialContentAnimation?: boolean
  /**
   * Callback fired when the disclosure content present state changes.
   */
  onContentPresentChange?: (present: boolean) => void
  /**
   * The `id` attribute of the disclosure content element.
   * @defaultValue `createUniqueId()`
   */
  disclosureId?: string
  /**
   * The `id` of the disclosure context. Useful if you have nested disclosures and want to create components that belong to a disclosure higher up in the tree.
   */
  contextId?: string
  /** @hidden */
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
  /** Whether the initial open animation of the disclosure content should be prevented. */
  preventInitialContentAnimation: boolean
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
      preventInitialContentAnimation: false,
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

  const { present: contentPresent } = createPresence({
    show: expanded,
    element: contentRef,
    onStateChange: (state) => {
      if (state === 'present') {
        defaultedProps.onContentPresentChange?.(true)
      } else if (state === 'hidden') {
        defaultedProps.onContentPresentChange?.(false)
      }
    },
  })

  let initialOpen = defaultedProps.preventInitialContentAnimation && expanded()

  createEffect<string | undefined>((animationName) => {
    expanded()
    const element = contentRef()
    if (!element) return
    if (initialOpen) {
      const origionalAnimationName = element.style.animationName
      element.style.animationName = 'none'
      initialOpen = false
      return origionalAnimationName
    }
    if (animationName === undefined) return
    element.style.animationName = animationName
  })

  // Updates the content size on every expanded change.
  createEffect(
    on([contentRef, contentPresent], ([element]) => {
      if (!element) {
        setContentSize(null)
        return
      }

      untrack(() => {
        const origionalAnimationName = element.style.animationName

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

        element.style.animationName = origionalAnimationName
      })
    }),
  )

  const childrenProps: DisclosureRootChildrenProps = {
    get expanded() {
      return expanded()
    },
    setExpanded,
    get collapseBehavior() {
      return defaultedProps.collapseBehavior
    },
    get preventInitialContentAnimation() {
      return defaultedProps.preventInitialContentAnimation
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
          preventInitialContentAnimation: () =>
            defaultedProps.preventInitialContentAnimation,
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
            preventInitialContentAnimation: () =>
              defaultedProps.preventInitialContentAnimation,
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
