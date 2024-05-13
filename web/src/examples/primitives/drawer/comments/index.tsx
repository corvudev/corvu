import { For, type VoidComponent } from 'solid-js'
import Drawer from '@corvu/drawer'

const DrawerCommentsExample: VoidComponent = () => {
  return (
    <Drawer snapPoints={[0, 0.7, 1]} allowSkippingSnapPoints={false}>
      {(props) => (
        <>
          <div class="my-auto flex flex-col items-center">
            <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
              Comments example
            </p>
            <Drawer.Trigger class="my-auto rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
              Open Drawer
            </Drawer.Trigger>
          </div>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-50 corvu-transitioning:transition-colors corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="group fixed inset-x-0 bottom-0 z-50 h-full max-h-[95%] rounded-t-lg border-t-4 border-corvu-400 bg-corvu-100 pt-3 after:absolute after:inset-x-0 after:top-full after:h-1/2 after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] md:select-none">
              <div
                class="flex flex-col corvu-group-transitioning:transition-[height] corvu-group-transitioning:duration-500 corvu-group-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  height: `${
                    props.openPercentage < 0.7 ? 70 : props.openPercentage * 100
                  }%`,
                }}
              >
                <div class="h-1 w-10 self-center rounded-full bg-corvu-400" />
                <Drawer.Label class="border-b-2 border-corvu-400 py-2 text-center text-xl font-bold">
                  Comments
                </Drawer.Label>
                <div class="grow divide-y divide-white/10 overflow-y-auto">
                  <For each={new Array(20)}>
                    {() => (
                      <div class="flex items-center space-x-2 p-2">
                        <div class="size-8 rounded-full bg-corvu-200" />
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
    </Drawer>
  )
}

export default DrawerCommentsExample
