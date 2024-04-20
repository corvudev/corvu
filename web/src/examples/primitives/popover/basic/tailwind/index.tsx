import { Gear } from '@examples/primitives/popover/icons'
import { Popover } from 'corvu/popover'
import type { VoidComponent } from 'solid-js'

const PopoverExample: VoidComponent = () => {
  return (
    <Popover
      floatingOptions={{
        offset: 13,
        flip: true,
        shift: true,
      }}
    >
      <Popover.Trigger class="my-auto rounded-full bg-corvu-100 p-3 transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
        <Gear size="26" />
        <span class="sr-only">Settings</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content class="rounded-lg bg-corvu-100 px-3 py-2 shadow-md corvu-open:animate-in corvu-open:fade-in-50 corvu-open:slide-in-from-top-1 corvu-closed:animate-out corvu-closed:fade-out-50 corvu-closed:slide-out-to-top-1">
          <Popover.Label class="font-bold">Settings</Popover.Label>
          <div class="grid grid-cols-[auto,1fr]">
            <label class="col-span-2 mt-2 grid grid-cols-subgrid">
              <span>Width</span>
              <input
                type="number"
                value="32"
                class="ml-10 w-20 rounded border-2 border-corvu-400 bg-corvu-200 px-2 py-1 text-sm"
              />
            </label>
            <label class="col-span-2 mt-2 grid grid-cols-subgrid">
              <span>Height</span>
              <input
                type="number"
                value="32"
                class="ml-10 w-20 rounded border-2 border-corvu-400 bg-corvu-200 px-2 py-1 text-sm"
              />
            </label>
          </div>
          <Popover.Arrow class="text-corvu-100" />
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  )
}

export default PopoverExample
