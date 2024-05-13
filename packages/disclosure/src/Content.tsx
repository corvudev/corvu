import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs, some } from '@corvu/utils/reactivity'
import { dataIf } from '@corvu/utils'
import type { Ref } from '@corvu/utils/dom'
import { useInternalDisclosureContext } from '@src/context'

export const DEFAULT_DISCLOSURE_CONTENT_ELEMENT = 'div'

export type DisclosureContentCorvuProps = {
  /**
   * Whether the disclosure content should be forced to render. Useful when using third-party animation libraries.
   * @defaultValue `false`
   */
  forceMount?: boolean
  /**
   * The `id` of the disclosure context to use.
   */
  contextId?: string
}

export type DisclosureContentSharedElementProps = {
  ref: Ref
  style: JSX.CSSProperties
}

export type DisclosureContentElementProps =
  DisclosureContentSharedElementProps & {
    id: string
    'data-collapsed': '' | undefined
    'data-expanded': '' | undefined
    'data-corvu-disclosure-content': '' | null
  }

export type DisclosureContentProps = DisclosureContentCorvuProps &
  Partial<DisclosureContentSharedElementProps>

/** Content of a disclosure. Can be animated.
 *
 * @data `data-corvu-disclosure-content` - Present on every disclosure content element.
 * @data `data-expanded` - Present when the disclosure is expanded.
 * @data `data-collapsed` - Present when the disclosure is collapsed.
 * @css `--corvu-disclosure-content-width` - The width of the disclosure content. Useful if you want to animate its width.
 * @css `--corvu-disclosure-content-height` - The height of the disclosure content. Useful if you want to animate its height.
 */
const DisclosureContent = <
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_CONTENT_ELEMENT,
>(
  props: DynamicProps<T, DisclosureContentProps, DisclosureContentElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DisclosureContentProps, [
    'forceMount',
    'contextId',
    'ref',
    'style',
  ])

  const context = createMemo(() =>
    useInternalDisclosureContext(localProps.contextId),
  )

  const show = () =>
    some(
      context().expanded,
      () => localProps.forceMount,
      context().contentPresent,
    )

  const contentWidth = createMemo(() => {
    const contentSize = context().contentSize()
    return contentSize ? contentSize[0] : undefined
  })

  const contentHeight = createMemo(() => {
    const contentSize = context().contentSize()
    return contentSize ? contentSize[1] : undefined
  })

  const memoizedDisclosureContent = createMemo(() => {
    const collapseBehavior = context().collapseBehavior()

    switch (collapseBehavior) {
      case 'hide':
        return (
          <Dynamic<DisclosureContentElementProps>
            as={DEFAULT_DISCLOSURE_CONTENT_ELEMENT}
            // === SharedElementProps ===
            ref={mergeRefs(context().setContentRef, localProps.ref)}
            style={{
              display: !show() ? 'none' : undefined,
              '--corvu-disclosure-content-width': `${contentWidth()}px`,
              '--corvu-disclosure-content-height': `${contentHeight()}px`,
              ...localProps.style,
            }}
            // === ElementProps ===
            id={context().disclosureId()}
            data-collapsed={dataIf(!context().expanded())}
            data-expanded={dataIf(context().expanded())}
            data-corvu-disclosure-content=""
            {...otherProps}
          />
        )
      case 'remove':
        return (
          <Show when={show()}>
            <Dynamic<DisclosureContentElementProps>
              as={DEFAULT_DISCLOSURE_CONTENT_ELEMENT}
              // === SharedElementProps ===
              ref={mergeRefs(context().setContentRef, localProps.ref)}
              style={{
                display: !show() ? 'none' : undefined,
                '--corvu-disclosure-content-width': `${contentWidth()}px`,
                '--corvu-disclosure-content-height': `${contentHeight()}px`,
                ...localProps.style,
              }}
              // === ElementProps ===
              id={context().disclosureId()}
              data-expanded={dataIf(context().expanded())}
              data-collapsed={dataIf(!context().expanded())}
              data-corvu-disclosure-content=""
              {...otherProps}
            />
          </Show>
        )
    }
  })

  return memoizedDisclosureContent as unknown as JSX.Element
}

export default DisclosureContent
