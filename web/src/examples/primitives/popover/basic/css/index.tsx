import './index.css'
import { Gear } from '@examples/primitives/popover/icons'
import Popover from 'corvu/popover'
import type { VoidComponent } from 'solid-js'

const PopoverExample: VoidComponent = () => {
  return (
    <Popover.Root
      floatingOptions={{
        offset: 13,
        flip: true,
        shift: true,
      }}
    >
      <Popover.Trigger>
        <Gear size="26" />
        <span class="sr-only">Settings</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <Popover.Label>Settings</Popover.Label>
          <div class="input_grid">
            <label>
              <span>Width</span>
              <input type="number" value="32" />
            </label>
            <label>
              <span>Height</span>
              <input type="number" value="32" />
            </label>
          </div>
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default PopoverExample
