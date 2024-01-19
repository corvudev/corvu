import Accordion from 'corvu/accordion'
import { type VoidComponent } from 'solid-js'

const AccordionExample: VoidComponent = () => {
  return (
    <div class="@xl:max-w-[400px] my-auto w-full max-w-[250px] overflow-hidden rounded-lg">
      <Accordion.Root collapseBehavior="hide">
        <Accordion.Item>
          <h3>
            <Accordion.Trigger class="w-full border-b border-corvu-200 bg-corvu-50 px-4 py-3 text-left font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-100 focus-visible:bg-corvu-200 focus-visible:outline-none">
              What is corvu?
            </Accordion.Trigger>
          </h3>
          <Accordion.Content class="overflow-hidden border-b border-corvu-200 bg-corvu-100 corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
            <div class="px-4 py-2">
              A collection of unstyled, customizable UI primitives for SolidJS.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h3>
            <Accordion.Trigger class="w-full border-b border-corvu-200 bg-corvu-50 px-4 py-3 text-left font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-100 focus-visible:bg-corvu-200 focus-visible:outline-none">
              Is it accessible?
            </Accordion.Trigger>
          </h3>
          <Accordion.Content class="overflow-hidden border-b border-corvu-200 bg-corvu-100 corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
            <div class="px-4 py-2">
              It has full keyboard support and adheres to the WAI-ARIA pattern
              for accordions.
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item>
          <h3>
            <Accordion.Trigger class="w-full border-b border-corvu-200 bg-corvu-50 px-4 py-3 text-left font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-100 focus-visible:bg-corvu-200 focus-visible:outline-none">
              Can I customize it?
            </Accordion.Trigger>
          </h3>
          <Accordion.Content class="overflow-hidden border-b border-corvu-200 bg-corvu-100 corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
            <div class="px-4 py-2">
              Yes, check out the API reference at the bottom for all options.
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

export default AccordionExample
