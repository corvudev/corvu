import Dialog from '@corvu/dialog'
import type { VoidComponent } from 'solid-js'

const DialogExample: VoidComponent = () => {
  return (
    <Dialog>
      <Dialog.Trigger class="my-auto rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
        Open Dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0%" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 min-w-80 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-corvu-400 bg-corvu-100 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
          <Dialog.Label class="text-lg font-bold">
            Nested dialog example
          </Dialog.Label>
          <div class="mt-3 flex justify-between">
            <Dialog.Close class="rounded-md bg-corvu-200 px-3 py-2">
              Close
            </Dialog.Close>
            <Dialog>
              <Dialog.Trigger class="rounded-md bg-corvu-300 px-3 py-2 font-bold">
                Open another dialog!
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Content class="fixed left-1/2 top-1/2 z-50 flex h-37 w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center space-y-4 rounded-lg border-2 border-corvu-400 bg-corvu-100 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
                  <Dialog.Label class="text-lg font-bold">
                    Hey! I'm a nested dialog 🐦‍⬛
                  </Dialog.Label>
                  <Dialog.Close class="rounded-md bg-corvu-300 px-3 py-2">
                    Close me
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

export default DialogExample
