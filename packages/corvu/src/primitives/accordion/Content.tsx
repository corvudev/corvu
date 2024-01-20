import { createMemo, type ValidComponent } from 'solid-js'
import type { DEFAULT_DISCLOSURE_TRIGGER_ELEMENT } from '@primitives/disclosure/Trigger'
import DisclosureContent from '@primitives/disclosure/Content'
import type { DisclosureContentProps } from '@primitives/disclosure/Content'
import { useInternalAccordionItemContext } from '@primitives/accordion/itemContext'

/** Content of an accordion item. Can be animated.
 *
 * @data `data-corvu-accordion-content` - Present on every accordion item content element.
 * @data `data-expanded` - Present when the accordion item is expanded.
 * @data `data-collapsed` - Present when the accordion item is collapsed.
 * @css `--corvu-disclosure-content-width` - The width of the accordion item content. Useful if you want to animate its width.
 * @css `--corvu-disclosure-content-height` - The height of the accordion item content. Useful if you want to animate its height.
 */
const AccordionContent = <
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
>(
  props: DisclosureContentProps<T>,
) => {
  const context = createMemo(() =>
    useInternalAccordionItemContext(props.contextId),
  )

  return (
    <DisclosureContent
      role="region"
      aria-labelledby={context().triggerId()}
      data-corvu-disclosure-content={undefined}
      data-corvu-accordion-content=""
      {...props}
    />
  )
}

export default AccordionContent
