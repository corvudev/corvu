import { type Component, createMemo, type ValidComponent } from 'solid-js'
import Disclosure, {
  type ContentCorvuProps as DisclosureContentCorvuProps,
  type ContentElementProps as DisclosureContentElementProps,
  type ContentSharedElementProps as DisclosureContentSharedElementProps,
} from '@corvu/disclosure'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { useInternalAccordionItemContext } from '@src/itemContext'

const DEFAULT_ACCORDION_CONTENT_ELEMENT = 'div'

export type AccordionContentCorvuProps = DisclosureContentCorvuProps

export type AccordionContentSharedElementProps =
  DisclosureContentSharedElementProps

export type AccordionContentElementProps =
  AccordionContentSharedElementProps & {
    role: 'region'
    'aria-labelledby': string | undefined
    'data-corvu-accordion-content': ''
  } & DisclosureContentElementProps

export type AccordionContentProps = AccordionContentCorvuProps &
  Partial<AccordionContentSharedElementProps>

/** Content of an accordion item. Can be animated.
 *
 * @data `data-corvu-accordion-content` - Present on every accordion item content element.
 * @data `data-expanded` - Present when the accordion item is expanded.
 * @data `data-collapsed` - Present when the accordion item is collapsed.
 * @css `--corvu-disclosure-content-width` - The width of the accordion item content. Useful if you want to animate its width.
 * @css `--corvu-disclosure-content-height` - The height of the accordion item content. Useful if you want to animate its height.
 */
const AccordionContent = <
  T extends ValidComponent = typeof DEFAULT_ACCORDION_CONTENT_ELEMENT,
>(
  props: DynamicProps<T, AccordionContentProps, AccordionContentElementProps>,
) => {
  const context = createMemo(() =>
    useInternalAccordionItemContext(props.contextId),
  )

  return (
    <Disclosure.Content<
      Component<
        Omit<AccordionContentElementProps, keyof DisclosureContentElementProps>
      >
    >
      as={DEFAULT_ACCORDION_CONTENT_ELEMENT}
      // === ElementProps ===
      role="region"
      aria-labelledby={context().triggerId()}
      data-corvu-accordion-content=""
      // === Misc ===
      data-corvu-disclosure-content={null}
      {...(props as AccordionContentProps)}
    />
  )
}

export default AccordionContent
