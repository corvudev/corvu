import createMediaQuery from '@examples/primitives/drawer/responsive/createMediaQuery'
import Dialog from '@corvu/dialog'
import Drawer from '@corvu/drawer'
import { Show } from 'solid-js'
import type { VoidComponent } from 'solid-js'

const DrawerResponsiveExample: VoidComponent = () => {
  const isDesktop = createMediaQuery('(min-width: 768px)')

  const MobileDrawer = () => (
    <Drawer breakPoints={[0.75]}>
      {(props) => (
        <>
          <Drawer.Trigger class="my-auto rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
            Edit Profile
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-50 data-transitioning:transition-colors data-transitioning:duration-500 data-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                'background-color': `rgb(0 0 0 / ${
                  0.5 * props.openPercentage
                })`,
              }}
            />
            <Drawer.Content class="fixed inset-x-0 bottom-0 z-50 h-full max-h-125 flex-col rounded-t-lg border-t-4 border-corvu-400 bg-corvu-100 pt-3 after:absolute after:inset-x-0 after:top-[calc(100%-1px)] after:h-1/2 after:bg-inherit data-transitioning:transition-transform data-transitioning:duration-500 data-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center md:select-none">
              <div class="max-w-80 w-full flex-col flex">
                <div class="h-1 w-10 self-center rounded-full bg-corvu-400" />
                <Drawer.Label class="mt-2 text-center text-xl font-bold">
                  Edit Profile
                </Drawer.Label>
                <Drawer.Description class="mt-1 text-center">
                  Make changes to your profile here
                </Drawer.Description>
                <p class="mt-3 text-sm">Username</p>
                <input
                  placeholder="corvu"
                  class="mt-1 w-full rounded-sm border-2 border-corvu-400 bg-corvu-100 focus:outline-hidden"
                />
                <div class="mt-3 flex justify-between">
                  <Drawer.Close class="rounded-md bg-corvu-200 px-3 py-2">
                    Cancel
                  </Drawer.Close>
                  <Drawer.Close class="rounded-md bg-corvu-300 px-3 py-2 font-bold">
                    Submit
                  </Drawer.Close>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )

  return (
    <Show when={isDesktop()} fallback={<MobileDrawer />}>
      <Dialog>
        <Dialog.Trigger class="my-auto rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5 slide-in-from-top-2">
          Edit Profile
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-corvu-400 bg-corvu-100 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
            <Dialog.Label class="text-xl font-bold">Edit Profile</Dialog.Label>
            <Dialog.Description class="mt-1">
              Make changes to your profile here
            </Dialog.Description>
            <p class="mt-3 text-sm">Username</p>
            <input
              placeholder="corvu"
              class="mt-1 w-full rounded-sm border-2 border-corvu-400 bg-corvu-100 focus:outline-hidden"
            />
            <div class="mt-3 flex justify-between">
              <Dialog.Close class="rounded-md bg-corvu-200 px-3 py-2">
                Cancel
              </Dialog.Close>
              <Dialog.Close class="rounded-md bg-corvu-300 px-3 py-2 font-bold">
                Submit
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </Show>
  )
}

export default DrawerResponsiveExample
