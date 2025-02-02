import Accordion from '@corvu/accordion'
import type { VoidComponent } from 'solid-js'

const AccordionExample: VoidComponent = () => {
  return (
    <div class="my-auto w-full max-w-62.5 overflow-hidden rounded-lg @xl:max-w-100">
      <Accordion collapseBehavior="hide">
        <Accordion.Item>
          <h2>
            <Accordion.Trigger class="w-full border-b border-corvu-300 bg-corvu-100 px-4 py-3 text-left font-medium transition-all duration-100 hover:bg-corvu-200 focus-visible:bg-corvu-200 focus-visible:outline-hidden">
              What is corvu?
            </Accordion.Trigger>
          </h2>
          <Accordion.Content class="overflow-hidden border-b border-corvu-300 bg-corvu-100 data-expanded:animate-expand data-collapsed:animate-collapse">
            <div class="px-4 py-2">
              A collection of unstyled, customizable UI primitives for SolidJS.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h2>
            <Accordion.Trigger class="w-full border-b border-corvu-300 bg-corvu-100 px-4 py-3 text-left font-medium transition-all duration-100 hover:bg-corvu-200 focus-visible:bg-corvu-200 focus-visible:outline-hidden">
              Is it accessible?
            </Accordion.Trigger>
          </h2>
          <Accordion.Content class="overflow-hidden border-b border-corvu-300 bg-corvu-100 data-expanded:animate-expand data-collapsed:animate-collapse">
            <div class="px-4 py-2">
              It has full keyboard support and adheres to the WAI-ARIA pattern
              for accordions.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h2>
            <Accordion.Trigger class="w-full border-b border-corvu-300 bg-corvu-100 px-4 py-3 text-left font-medium transition-all duration-100 hover:bg-corvu-200 focus-visible:bg-corvu-200 focus-visible:outline-hidden">
              Can I customize it?
            </Accordion.Trigger>
          </h2>
          <Accordion.Content class="overflow-hidden border-b border-corvu-300 bg-corvu-100 data-expanded:animate-expand data-collapsed:animate-collapse">
            <div class="px-4 py-2">
              Yes, check out the API reference at the bottom for all options.
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default AccordionExample
