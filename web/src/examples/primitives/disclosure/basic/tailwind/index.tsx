import { CaretUpDown, X } from '@examples/primitives/disclosure/icons'
import Disclosure from '@corvu/disclosure'
import type { VoidComponent } from 'solid-js'

const DisclosureExample: VoidComponent = () => {
  return (
    <div class="mt-8">
      <Disclosure collapseBehavior="hide">
        {(props) => (
          <>
            <div class="mb-2 flex items-center justify-between space-x-4">
              <p class="font-medium text-corvu-text-dark">
                Jasmin starred 3 repositories
              </p>
              <Disclosure.Trigger class="rounded-lg bg-corvu-100 p-1 transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
                {props.expanded && (
                  <>
                    <X size="20" />
                    <span class="sr-only">Collapse</span>
                  </>
                )}
                {!props.expanded && (
                  <>
                    <CaretUpDown size="20" />
                    <span class="sr-only">Expand</span>
                  </>
                )}
              </Disclosure.Trigger>
            </div>
            <div class="rounded-lg bg-corvu-100 px-3 py-2">corvudev/corvu</div>
            <Disclosure.Content class="mt-1 space-y-1 overflow-hidden corvu-expanded:animate-expand corvu-collapsed:animate-collapse">
              <div class="rounded-lg bg-corvu-100 px-3 py-2">solidjs/solid</div>
              <div class="rounded-lg bg-corvu-100 px-3 py-2">
                nitropage/nitropage
              </div>
            </Disclosure.Content>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default DisclosureExample
