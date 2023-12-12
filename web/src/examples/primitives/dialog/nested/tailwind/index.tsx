import Dialog from 'corvu/dialog'
import type { VoidComponent } from 'solid-js'

const DialogExample: VoidComponent = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger class="rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium text-corvu-dark transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
        Open Dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-corvu-1000/60" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 min-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-corvu-400 bg-corvu-1000 px-6 py-5 duration-200 corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-[60%] corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-[60%]">
          <Dialog.Label class="text-lg font-bold">
            Nested dialog example
          </Dialog.Label>
          <div class="mt-3 flex justify-between">
            <Dialog.Close class="rounded-md bg-corvu-200 px-3 py-2 text-corvu-dark">
              Close
            </Dialog.Close>
            <Dialog.Root>
              <Dialog.Trigger class="rounded-md bg-corvu-400 px-3 py-2 font-bold text-corvu-dark">
                Open another dialog!
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content class="fixed left-1/2 top-1/2 z-50 flex h-[150px] w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center space-y-4 rounded-lg border-2 border-corvu-400 bg-corvu-1000 px-6 py-5 duration-200 corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-[60%] corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-[60%]">
                  <Dialog.Label class="text-lg font-bold">
                    Hey! I'm a nested dialog 🐦‍⬛
                  </Dialog.Label>
                  <Dialog.Close class="rounded-md bg-corvu-200 px-3 py-2 text-corvu-dark">
                    Close me
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogExample
