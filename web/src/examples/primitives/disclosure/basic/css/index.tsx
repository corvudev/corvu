import './index.css'
import { CaretUpDown, X } from '@examples/primitives/disclosure/icons'
import Disclosure from '@corvu/disclosure'
import type { VoidComponent } from 'solid-js'

const DisclosureExample: VoidComponent = () => {
  return (
    <div>
      <Disclosure collapseBehavior="hide">
        {(props) => (
          <>
            <div class="header">
              <p class="header_title">Jasmin starred 3 repositories</p>
              <Disclosure.Trigger>
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
            <div class="repository_card">corvudev/corvu</div>
            <Disclosure.Content>
              <div class="repository_card">solidjs/solid</div>
              <div class="repository_card">nitropage/nitropage</div>
            </Disclosure.Content>
          </>
        )}
      </Disclosure>
    </div>
  )
}

export default DisclosureExample
