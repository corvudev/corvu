import Drawer from 'corvu/drawer'
import type { VoidComponent } from 'solid-js'

const DrawerSnapPointExample: VoidComponent = () => {
  return (
    <Drawer.Root snapPoints={[0, 0.5, 1]} allowSkippingSnapPoints={false}>
      {(props) => (
        <>
          <div class="my-auto flex flex-col items-center">
            <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
              Snappoints example
            </p>
            <Drawer.Trigger class="rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
              Open Drawer
            </Drawer.Trigger>
          </div>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-50 corvu-transitioning:transition-colors corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(12 8 18 / ${
                  0.7 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[500px] flex-col rounded-t-lg border-t-4 border-corvu-400 bg-corvu-1000 pt-3 after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] md:select-none">
              <div class="h-1 w-10 self-center rounded-full bg-corvu-50" />
              <Drawer.Label class="mt-2 text-center text-xl font-bold">
                I'm a drawer!
              </Drawer.Label>
              <Drawer.Description class="mt-1 text-center">
                I will snap at <span class="font-bold">50%</span> of my height.{' '}
                <br /> My current height is:{' '}
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

export default DrawerSnapPointExample
