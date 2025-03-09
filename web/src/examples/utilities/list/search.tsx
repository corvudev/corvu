import { createSignal, For, Show } from 'solid-js'
import clsx from 'clsx'
import { createList } from 'solid-list'

const ITEMS = ['Rook', 'Chough', 'Raven', 'Jackdaw', 'Magpie', 'Jay']

const SearchListExample = () => {
  const [searchValue, setSearchValue] = createSignal<string>('')
  const [selectedCrow, setSelectedCrow] = createSignal<string | null>(null)

  const filteredCrows = () =>
    ITEMS.filter((crow) =>
      crow.toLowerCase().includes(searchValue().toLowerCase()),
    )

  const { active, setActive, onKeyDown } = createList({
    items: () => [...Array(filteredCrows().length).keys()],
    handleTab: false,
  })

  return (
    <div class="flex w-full flex-col items-center p-5 select-none md:px-10">
      <div class="space-y-2 w-full max-w-80">
        <div class="relative">
          <input
            placeholder="Search crows"
            aria-label="Search crows"
            role="searchbox"
            spellcheck={false}
            value={searchValue()}
            class="w-full rounded-md border-0 bg-corvu-bg px-3 py-2 transition-all focus-visible:ring-2 focus-visible:ring-corvu-text"
            onInput={(event) => {
              setSearchValue((event.target as HTMLInputElement).value)
              setActive(0)
              setSelectedCrow(null)
            }}
            onFocus={() => setActive(0)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const selectedCrow = active()
                if (selectedCrow === null) return
                setSelectedCrow(filteredCrows()[selectedCrow])
              } else if (e.key === 'Escape') {
                setSearchValue('')
              } else {
                onKeyDown(e)
              }
            }}
          />
          <Show when={searchValue()}>
            <button
              class="absolute inset-y-0 right-0 p-2"
              onClick={() => setSearchValue('')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 256 256"
                class="size-4"
              >
                <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z" />
              </svg>
            </button>
          </Show>
        </div>
        <Show
          when={filteredCrows().length}
          fallback={
            <p class="px-3 py-2 text-center text-corvu-text-dark">
              No results for "<span class="font-bold">{searchValue()}</span>"
            </p>
          }
        >
          <ul role="listbox" class="rounded-md overflow-hidden">
            <For each={filteredCrows()}>
              {(crow, index) => (
                <li
                  role="option"
                  aria-selected={active() === index()}
                  onMouseMove={() => setActive(index())}
                  onClick={() => setSelectedCrow(crow)}
                  class={clsx('px-3 py-2', {
                    'bg-corvu-bg': active() !== index(),
                    'bg-corvu-200': active() === index(),
                  })}
                >
                  {crow}
                </li>
              )}
            </For>
          </ul>
        </Show>
        <Show when={selectedCrow()}>
          <p class="px-3 py-2 text-center text-corvu-text-dark">
            Selected: <span class="font-bold">{selectedCrow()}</span>
          </p>
        </Show>
      </div>
    </div>
  )
}

export default SearchListExample
