import { createSignal, For, type VoidComponent } from 'solid-js'
import clsx from 'clsx'
import Dialog from 'corvu/dialog'

const DialogDev: VoidComponent = () => {
  return (
    <div class="grid grid-cols-2 place-items-center gap-10">
      <div class="space-y-1 text-center">
        <p class="font-bold">Uncontrolled</p>
        <Uncontrolled />
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Controlled</p>
        <Controlled />
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Context</p>
        <Dialog>
          <Context />
        </Dialog>
      </div>
      <div class="space-y-1 text-center">
        <p class="font-bold">Children props</p>
        <Children />
      </div>
    </div>
  )
}

const Uncontrolled: VoidComponent = () => {
  return (
    <Dialog>
      <Dialog.Trigger class="rounded bg-white px-3 py-2 text-sm text-purple-600 shadow transition-colors hover:bg-gray-100">
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50" />
        <Dialog.Content
          class={clsx(
            'fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg',
            'duration-200 corvu-open:animate-in corvu-open:fade-in-0 corvu-open:zoom-in-95 corvu-open:slide-in-from-left-1/2 corvu-open:slide-in-from-top-[48%]',
            'corvu-closed:animate-out corvu-closed:fade-out-0 corvu-closed:zoom-out-95 corvu-closed:slide-out-to-left-1/2 corvu-closed:slide-out-to-top-[48%]',
          )}
        >
          <Dialog.Close class="absolute right-2 top-2 rounded bg-white p-2 shadow">
            close
          </Dialog.Close>
          <Dialog.Label class="font-bold">Hello</Dialog.Label>
          <Dialog.Description class="text-sm">Desc</Dialog.Description>
          <p class="text-xs">Random text</p>
          <div class="max-h-[400px] overflow-y-auto border border-purple-700">
            <For each={new Array(100).fill(0)}>{(_, i) => <p>{i()}</p>}</For>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const Controlled: VoidComponent = () => {
  const [open, setOpen] = createSignal(false)

  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <p class="text-sm">
        Controlled state:{' '}
        <span class="font-mono">{open() ? 'open' : 'closed'}</span>
      </p>
      <Dialog.Trigger class="rounded bg-white px-3 py-2 text-sm text-purple-600 shadow transition-colors hover:bg-gray-100">
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
          <Dialog.Close class="absolute right-2 top-2 rounded bg-white p-2 shadow">
            close
          </Dialog.Close>
          <Dialog.Label class="font-bold">Hello</Dialog.Label>
          <Dialog.Description class="text-sm">Desc</Dialog.Description>
          <p class="text-xs">Random text</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}

const Context: VoidComponent = () => {
  const dialogContext = Dialog.useContext()

  return (
    <>
      <p class="text-sm">
        State from context:{' '}
        <span class="font-mono">
          {dialogContext.open() ? 'open' : 'closed'}
        </span>
      </p>
      <Dialog.Trigger class="rounded bg-white px-3 py-2 text-sm text-purple-600 shadow transition-colors hover:bg-gray-100">
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 bg-black/50" />
        <Dialog.Content class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
          <Dialog.Close class="absolute right-2 top-2 rounded bg-white p-2 shadow">
            close
          </Dialog.Close>
          <Dialog.Label class="font-bold">Hello</Dialog.Label>
          <Dialog.Description class="text-sm">Desc</Dialog.Description>
          <p class="text-xs">Random text</p>
        </Dialog.Content>
      </Dialog.Portal>
    </>
  )
}

const Children: VoidComponent = () => {
  return (
    <Dialog>
      {(props) => (
        <>
          <p class="text-sm">
            State from parent:{' '}
            <span class="font-mono">{props.open ? 'open' : 'closed'}</span>
          </p>
          <Dialog.Trigger class="rounded bg-white px-3 py-2 text-sm text-purple-600 shadow transition-colors hover:bg-gray-100">
            Open
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay class="fixed inset-0 bg-black/50" />
            <Dialog.Content class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
              <Dialog.Close class="absolute right-2 top-2 rounded bg-white p-2 shadow">
                close
              </Dialog.Close>
              <Dialog.Label class="font-bold">Hello</Dialog.Label>
              <Dialog.Description class="text-sm">Desc</Dialog.Description>
              <p class="text-xs">Random text</p>
            </Dialog.Content>
          </Dialog.Portal>
        </>
      )}
    </Dialog>
  )
}

export default DialogDev
