import { Star } from '@examples/primitives/tooltip/icons'
import { Tooltip } from 'corvu/tooltip'
import type { VoidComponent } from 'solid-js'

const TooltipExample: VoidComponent = () => {
  return (
    <Tooltip
      placement="top"
      openDelay={200}
      floatingOptions={{
        offset: 13,
        flip: true,
        shift: true,
      }}
    >
      <Tooltip.Trigger
        as="a"
        class="my-auto rounded-full bg-corvu-100 p-3 transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5"
        href="https://github.com/corvudev/corvu/"
        target="_blank"
      >
        <Star size="26" />
        <span class="sr-only">Corvu on GitHub</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content class="rounded-lg bg-corvu-100 px-3 py-2 font-medium corvu-open:animate-in corvu-open:fade-in-50 corvu-open:slide-in-from-bottom-1 corvu-closed:animate-out corvu-closed:fade-out-50 corvu-closed:slide-out-to-bottom-1">
          Give corvu a star! ⭐️
          <Tooltip.Arrow class="text-corvu-100" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  )
}

export default TooltipExample
