import './index.css'
import { Star } from '@examples/primitives/tooltip/icons'
import Tooltip from 'corvu/tooltip'
import type { VoidComponent } from 'solid-js'

const TooltipExample: VoidComponent = () => {
  return (
    <Tooltip.Root
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
        href="https://github.com/corvudev/corvu/"
        target="_blank"
      >
        <Star size="26" />
        <span class="sr-only">Corvu on GitHub</span>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content>
          Give corvu a star! ⭐️
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

export default TooltipExample
