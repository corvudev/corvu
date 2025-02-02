import { createEffect, createSignal, For, onCleanup } from 'solid-js'
import clsx from 'clsx'
import { createMultiList } from 'solid-list'

const ITEMS = ['Rook', 'Chough', 'Raven', 'Jackdaw', 'Magpie', 'Jay']

const MultiListExample = () => {
  const [refs, setRefs] = createSignal<HTMLDivElement[]>([])

  const {
    cursor,
    active,
    setCursorActive,
    selected,
    toggleSelected,
    onKeyDown,
  } = createMultiList({
    items: ITEMS,
    vimMode: true,
    onCursorChange: (item) => {
      if (item === null) return
      refs()[ITEMS.indexOf(item)]?.focus()
    },
  })

  createEffect(() => {
    document.addEventListener('mousedown', onMouseDown)
    onCleanup(() => document.removeEventListener('mousedown', onMouseDown))
  })
  const onMouseDown = () => setCursorActive(null)

  return (
    <div class="flex w-full flex-col items-center space-y-2 p-5 md:px-10">
      <For each={ITEMS}>
        {(crow) => (
          <div
            ref={(ref) => setRefs((refs) => [...refs, ref])}
            role="checkbox"
            aria-checked={selected().includes(crow)}
            tabindex="0"
            onFocus={() => {
              if (cursor() !== null) return
              setCursorActive(crow)
            }}
            onKeyDown={(e) => {
              if (e.key === 'x' || e.key === ' ' || e.key === 'Enter') {
                toggleSelected(crow)
                e.preventDefault()
                return
              }
              onKeyDown(e)
            }}
            onClick={() => {
              setCursorActive(crow)
              toggleSelected(crow)
            }}
            class={clsx(
              'flex w-full cursor-default max-w-80 items-center space-x-2 rounded-md px-4 py-2 transition-all hover:scale-101 hover:bg-corvu-200 focus:outline-hidden',
              {
                'bg-corvu-bg': !active().includes(crow),
                'bg-corvu-200 scale-101': active().includes(crow),
              },
            )}
          >
            <div class="flex size-6 items-center justify-center rounded-sm border-2 border-corvu-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 22 22"
                class={clsx('size-3 transition-all', {
                  'opacity-0': !selected().includes(crow),
                  'opacity-100': selected().includes(crow),
                })}
              >
                <path
                  fill="currentColor"
                  d="M7.868 13.72 3.546 9.398a2.078 2.078 0 1 0-2.937 2.938l5.79 5.79a2.072 2.072 0 0 0 2.264.45c.252-.104.481-.258.674-.45L20.918 6.544a2.077 2.077 0 0 0-2.938-2.938L7.868 13.72Z"
                />
              </svg>
            </div>
            <p>{crow}</p>
          </div>
        )}
      </For>
    </div>
  )
}

export default MultiListExample
