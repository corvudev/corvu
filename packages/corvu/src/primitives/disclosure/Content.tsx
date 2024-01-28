import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { dataIf, mergeRefs, some } from '@lib/utils'
import type { OverrideComponentProps } from '@lib/types'
import Polymorphic from '@lib/components/Polymorphic'
import type { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { useInternalDisclosureContext } from '@primitives/disclosure/context'

export const DEFAULT_DISCLOSURE_CONTENT_ELEMENT = 'div'

export type DisclosureContentProps<
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_CONTENT_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /**
     * Whether the disclosure content should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the disclosure context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
    /** @hidden */
    children?: JSX.Element
    /** @hidden */
    'data-corvu-disclosure-content'?: string | undefined
  }
>

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
  props: DisclosureContentProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'forceMount',
    'contextId',
    'ref',
    'style',
    'children',
    'data-corvu-disclosure-content',
  ])

  const context = createMemo(() =>
    useInternalDisclosureContext(localProps.contextId),
  )

  const show = () =>
    some(
      context().expanded,
      // eslint-disable-next-line solid/reactivity
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

  const keepAlive = createMemo((prev) => prev || show(), false)

  const memoizedDisclosureContent = createMemo(() => {
    const collapseBehavior = context().collapseBehavior()

    switch (collapseBehavior) {
      case 'hide':
        return (
          <Polymorphic
            ref={mergeRefs(context().setContentRef, localProps.ref)}
            as={
              localProps.as ??
              (DEFAULT_DISCLOSURE_CONTENT_ELEMENT as ValidComponent)
            }
            id={context().disclosureId()}
            data-expanded={dataIf(context().expanded())}
            data-collapsed={dataIf(!context().expanded())}
            data-corvu-disclosure-content={
              localProps.hasOwnProperty('data-corvu-disclosure-content')
                ? localProps['data-corvu-disclosure-content']
                : ''
            }
            style={{
              display: !show() ? 'none' : undefined,
              '--corvu-disclosure-content-width': `${contentWidth()}px`,
              '--corvu-disclosure-content-height': `${contentHeight()}px`,
              ...localProps.style,
            }}
            {...otherProps}
          >
            {localProps.children}
          </Polymorphic>
        )
      case 'remove':
        return (
          <Show when={keepAlive()}>
            {(() => {
              const memoizedChildren = createMemo(() => localProps.children)

              return (
                <Show when={show()}>
                  <Polymorphic
                    ref={mergeRefs(context().setContentRef, localProps.ref)}
                    as={
                      localProps.as ??
                      (DEFAULT_DISCLOSURE_CONTENT_ELEMENT as ValidComponent)
                    }
                    id={context().disclosureId()}
                    data-expanded={dataIf(context().expanded())}
                    data-collapsed={dataIf(!context().expanded())}
                    data-corvu-disclosure-content={
                      localProps.hasOwnProperty('data-corvu-disclosure-content')
                        ? localProps['data-corvu-disclosure-content']
                        : ''
                    }
                    style={{
                      display: !show() ? 'none' : undefined,
                      '--corvu-disclosure-content-width': `${contentWidth()}px`,
                      '--corvu-disclosure-content-height': `${contentHeight()}px`,
                      ...localProps.style,
                    }}
                    {...otherProps}
                  >
                    {memoizedChildren()}
                  </Polymorphic>
                </Show>
              )
            })()}
          </Show>
        )
    }
  })

  return memoizedDisclosureContent as unknown as JSX.Element
}

export default DisclosureContent
