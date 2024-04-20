import { For, type VoidComponent } from 'solid-js'
import clsx from 'clsx'
import { Drawer } from 'corvu/drawer'

const DrawerDev: VoidComponent = () => {
  return (
    <div class="grid grid-cols-2 place-items-center gap-10">
      <div class="space-y-1 text-center">
        <p class="font-bold">Open Drawer Bottom</p>
        <Uncontrolled side="bottom" />
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Open Drawer Top</p>
        <Uncontrolled side="top" />
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Open Drawer Left</p>
        <Uncontrolled side="left" />
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Open Drawer Right</p>
        <Uncontrolled side="right" />
      </div>
    </div>
  )
}

const Uncontrolled: VoidComponent<{
  side: 'top' | 'right' | 'bottom' | 'left'
}> = (props) => {
  return (
    <Drawer side={props.side}>
      {(props) => (
        <>
          <Drawer.Trigger class="rounded bg-white px-3 py-2 text-sm text-purple-600 shadow transition-colors hover:bg-gray-100">
            Open
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Content
              class={clsx(
                'peer fixed z-10',
                'after:absolute after:inset-x-0 after:bg-inherit',
                'bg-white',
                'flex flex-col p-10',
                'lg:select-none',
                'corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]',
                {
                  'after:top-full inset-x-0 bottom-0 rounded-t-lg h-full max-h-[80%] after:h-[200%]':
                    props.side == 'bottom',
                  'after:bottom-full inset-x-0 top-0 rounded-b-lg h-full max-h-[80%] after:h-[200%]':
                    props.side == 'top',
                  'after:right-full inset-y-0 left-0 rounded-r-lg w-full max-w-[80%] after:w-[200%]':
                    props.side == 'left',
                  'after:left-full inset-y-0 right-0 rounded-l-lg w-full max-w-[80%] after:w-[200%]':
                    props.side == 'right',
                },
              )}
            >
              <Drawer.Close class="absolute right-2 top-2 rounded bg-white p-2 shadow">
                close
              </Drawer.Close>
              <Drawer.Label class="font-bold">Drawer Label</Drawer.Label>
              <Drawer.Description class="text-sm">
                Drawer Description
              </Drawer.Description>
              <div class="max-h-[400px] overflow-y-auto border border-purple-700">
                <For each={new Array(100).fill(0)}>
                  {(_, i) => <p>{i()}</p>}
                </For>
              </div>
            </Drawer.Content>
            <Drawer.Overlay
              class={clsx(
                'fixed inset-0',
                'corvu-peer-transitioning:transition-colors corvu-peer-transitioning:duration-500 corvu-peer-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]',
              )}
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

export default DrawerDev
