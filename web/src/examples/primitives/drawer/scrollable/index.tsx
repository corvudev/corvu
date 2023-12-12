import clsx from 'clsx'
import Drawer from 'corvu/drawer'
import { For, type VoidComponent } from 'solid-js'

const DrawerScrollableExample: VoidComponent = () => {
  return (
    <Drawer.Root>
      {(props) => (
        <>
          <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
            Scrollable example
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
            <Drawer.Content class="peer fixed inset-x-0 bottom-0 z-50 mx-auto flex h-full max-h-[500px] flex-col rounded-t-lg border-t-4 border-corvu-400 bg-corvu-dark pt-3 after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] lg:select-none">
              <div class="h-1 w-10 shrink-0 self-center rounded-full bg-corvu-50" />
              <Drawer.Label class="mt-2 text-center text-xl font-bold">
                Drawer with a scrollable element
              </Drawer.Label>
              <div class="mt-3 grow divide-y divide-corvu-400 overflow-y-auto">
                <For each={new Array(50)}>
                  {(_, idx) => (
                    <p
                      class={clsx(
                        'py-2 text-center font-bold text-corvu-dark',
                        {
                          'bg-corvu-500': idx() % 2 === 0,
                          'bg-corvu-600': idx() % 2 === 1,
                        },
                      )}
                    >
                      List item {idx() + 1}
                    </p>
                  )}
                </For>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )
}

export default DrawerScrollableExample
