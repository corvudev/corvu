import Drawer from 'corvu/drawer'
import { For, type VoidComponent } from 'solid-js'

const DrawerCommentsExample: VoidComponent = () => {
  return (
    <Drawer.Root snapPoints={[0, 0.7, 1]} allowSkippingSnapPoints={false}>
      {(props) => (
        <>
          <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
            Comments example
          </p>
          <Drawer.Trigger class="rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
            Open Drawer
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-40 corvu-peer-transitioning:transition-colors corvu-peer-transitioning:duration-500 corvu-peer-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="group peer fixed inset-x-0 bottom-0 z-50 mx-auto h-full max-h-[95%] rounded-t-lg border-t-4 border-corvu-400 bg-corvu-1000 pt-3 after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] lg:select-none">
              <div
                class="flex flex-col corvu-group-transitioning:transition-[height] corvu-group-transitioning:duration-500 corvu-group-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  height: `${
                    props.openPercentage < 0.7 ? 70 : props.openPercentage * 100
                  }%`,
                }}
              >
                <div class="h-1 w-10 shrink-0 self-center rounded-full bg-corvu-50" />
                <Drawer.Label class="border-b-2 border-corvu-400 py-2 text-center text-xl font-bold">
                  Comments
                </Drawer.Label>
                <div class="grow divide-y divide-white/10 overflow-y-auto">
                  <For each={new Array(20)}>
                    {() => (
                      <div class="flex items-center space-x-2 p-2">
                        <div class="h-8 w-8 rounded-full bg-corvu-800" />
                        <div>
                          <p class="font-bold">Username</p>
                          <p class="text-sm">This is a comment</p>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <div class="z-10 border-t-2 border-corvu-400 p-2 text-center text-lg font-bold">
                  Comments Footer
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )
}

export default DrawerCommentsExample
