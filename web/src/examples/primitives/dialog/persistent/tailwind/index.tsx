import createPersistent from 'solid-persistent'
import Dialog from '@corvu/dialog'
import type { VoidComponent } from 'solid-js'

const PersistentDialogExample: VoidComponent = () => {
  const persistedContent = createPersistent(DialogContent)

  return (
    <Dialog>
      <Dialog.Trigger class="my-auto rounded-lg bg-corvu-100 px-4 py-3 text-lg font-medium transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5">
        Open Persistent Dialog
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0%" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-corvu-400 bg-corvu-100 px-6 py-5 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-95% data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-95% data-closed:slide-out-to-top-10%">
          {persistedContent()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const DialogContent = () => (
  <>
    <Dialog.Label class="text-lg font-bold">
      Persistent dialog content
    </Dialog.Label>
    <Dialog.Description class="mt-2">
      This dialog will preserve the state inside the content,
      <br /> even after it gets unmounted from the DOM.
      <br /> Enter something in the input and reopen the dialog.
    </Dialog.Description>
    <input class="mt-4 rounded-sm border border-corvu-200 bg-corvu-bg px-3 py-2 ring-2 ring-corvu-400 focus-visible:border focus-visible:border-corvu-200 focus-visible:ring-2 focus-visible:ring-corvu-400" />
    <p class="mt-3 text-sm">
      💡 I'm an uncontrolled input, preserving my state because I never
      rerender!
    </p>
  </>
)

export default PersistentDialogExample
