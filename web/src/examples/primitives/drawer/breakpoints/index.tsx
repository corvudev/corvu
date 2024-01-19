import Drawer from 'corvu/drawer'
import type { VoidComponent } from 'solid-js'

const DrawerBreakPointExample: VoidComponent = () => {
  return (
    <Drawer.Root breakPoints={[0.75]} velocityFunction={() => 1}>
      {(props) => (
        <>
          <div class="my-auto flex flex-col items-center">
            <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
              Breakpoints example
            </p>
            <Drawer.Trigger class="rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
              Open Drawer
            </Drawer.Trigger>
          </div>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-40 corvu-peer-transitioning:transition-colors corvu-peer-transitioning:duration-500 corvu-peer-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="peer fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[500px] flex-col rounded-t-lg border-t-4 border-corvu-400 bg-corvu-1000 pt-3 after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] lg:select-none">
              <div class="h-1 w-10 self-center rounded-full bg-corvu-50" />
              <Drawer.Label class="mt-2 text-center text-xl font-bold">
                I'm a drawer!
              </Drawer.Label>
              <Drawer.Description class="mt-1 text-center">
                I will close when I'm under <span class="font-bold">75%</span>{' '}
                of my height. <br /> My current height is:{' '}
                <span class="font-bold">
                  {(props.openPercentage * 100).toFixed(2)}%
                </span>
              </Drawer.Description>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )
}

export default DrawerBreakPointExample
