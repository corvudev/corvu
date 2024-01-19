import Accordion from 'corvu/accordion'
import type { VoidComponent } from 'solid-js'

const AccordionExample: VoidComponent = () => {
  return (
    <div class="wrapper">
      <Accordion.Root collapseBehavior="hide">
        <Accordion.Item>
          <h3>
            <Accordion.Trigger>What is corvu?</Accordion.Trigger>
          </h3>
          <Accordion.Content>
            <div class="content_wrapper">
              A collection of unstyled, customizable UI primitives for SolidJS.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h3>
            <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
          </h3>
          <Accordion.Content>
            <div class="content_wrapper">
              It has full keyboard support and adheres to the WAI-ARIA pattern
              for accordions.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h3>
            <Accordion.Trigger>Can I customize it?</Accordion.Trigger>
          </h3>
          <Accordion.Content>
            <div class="content_wrapper">
              Yes, check out the API reference at the bottom for all options.
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export default AccordionExample
