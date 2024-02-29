import { createSignal, type VoidComponent } from 'solid-js'
import Drawer from 'corvu/drawer'

const heightSequence = [500, 400, 300, 400]

const DrawerTransitionResizeExample: VoidComponent = () => {
  const [currentHeight, setCurrentHeight] = createSignal(400)

  return (
    <Drawer.Root transitionResize>
      {(props) => (
        <>
          <div class="my-auto flex flex-col items-center">
            <p class="mb-2 rounded-lg bg-corvu-300 px-2 py-1 font-bold">
              Transition resize example
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
            <Drawer.Content class="group fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-lg border-t-4 border-corvu-400 bg-corvu-100 pt-3 after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit corvu-transitioning:transition-[transform,height] corvu-transitioning:duration-500 corvu-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] md:select-none">
              <div class="h-1 w-10 self-center rounded-full bg-corvu-400" />
              <Drawer.Label class="mt-2 text-center text-xl font-bold">
                Dynamic content height example
              </Drawer.Label>
              <Drawer.Description class="mt-1 text-center">
                I will transition between height changes
              </Drawer.Description>
              <button
                onClick={() => {
                  const nextHeight = heightSequence.shift()
                  if (nextHeight) {
                    setCurrentHeight(nextHeight)
                    heightSequence.push(nextHeight)
                  }
                }}
                class="mx-auto mt-2 rounded-md bg-corvu-100 px-3 py-2 font-medium"
              >
                Resize content
              </button>
              <div
                class="mx-5 mb-5 mt-3 flex items-center justify-center rounded-lg border-2 border-corvu-400 corvu-group-resizing:grow"
                style={{
                  height: `${currentHeight()}px`,
                }}
              >
                <p class="text-2xl">🌟</p>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )
}

export default DrawerTransitionResizeExample
