import createPersistent from 'solid-persistent'
import Drawer from '@corvu/drawer'
import type { VoidComponent } from 'solid-js'

const DrawerNoDragExample: VoidComponent = () => {
  const persistedContent = createPersistent(DrawerContent)

  return (
    <Drawer>
      {(props) => (
        <>
          <div class="my-auto flex flex-col items-center">
            <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
              No drag example
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
            <Drawer.Content class="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[80%] flex-col items-center rounded-t-lg border-t-4 border-corvu-400 bg-corvu-100 px-5 pt-3 after:absolute after:inset-x-0 after:top-[calc(100%-1px)] after:h-1/2 after:bg-inherit corvu-transitioning:transition-transform corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] md:max-h-[500px] md:select-none">
              {persistedContent()}
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

const DrawerContent = () => (
  <>
    <div class="h-1 w-10 self-center rounded-full bg-corvu-400" />
    <Drawer.Label class="text-lg font-bold">
      Persistent drawer content
    </Drawer.Label>
    <Drawer.Description class="mt-2 text-center">
      This drawer will preserve the state inside the content,
      <br /> even after it gets unmounted from the DOM.
      <br /> Enter something in the input and reopen the drawer.
    </Drawer.Description>
    <input class="mt-4 rounded border border-corvu-200 bg-corvu-bg px-3 py-2 ring-2 ring-corvu-400 focus-visible:border focus-visible:border-corvu-200 focus-visible:ring-2 focus-visible:ring-corvu-400" />
    <p class="mt-3 text-center text-sm">
      💡 I'm an uncontrolled input, preserving my state because I never
      rerender!
    </p>
  </>
)

export default DrawerNoDragExample
