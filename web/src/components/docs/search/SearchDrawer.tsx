import { createEffect, createSignal } from 'solid-js'
import Search, { type SearchResult } from '@components/docs/search/Search'
import Drawer from '@corvu/drawer'

const SearchDrawer = () => {
  const [open, setOpen] = createSignal(false)
  const [searchValue, setSearchValue] = createSignal('')
  const [result, setResult] = createSignal<SearchResult | null>(null)

  createEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('s')) {
      setOpen(true)
      setSearchValue(urlParams.get('s')!)
      urlParams.delete('s')
      window.history.replaceState(
        null,
        document.title,
        window.location.pathname + urlParams.toString(),
      )
    }
  })

  return (
    <Drawer
      open={open()}
      onOpenChange={(open) => {
        setOpen(open)
        if (open) return
        setSearchValue('')
        setResult({})
      }}
      restoreScrollPosition={false}
    >
      {(props) => (
        <>
          <Drawer.Trigger class="p-2 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
              class="size-5"
            >
              <path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z" />
            </svg>
            <span class="sr-only">Search docs</span>
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
            <Drawer.Content class="fixed inset-x-0 bottom-0 z-50 flex h-full max-h-[85%] flex-col rounded-t-lg bg-corvu-bg pt-4 after:absolute after:inset-x-0 after:top-[calc(100%-1px)] after:h-1/2 after:bg-inherit data-transitioning:transition-transform data-transitioning:duration-500 data-transitioning:ease-[cubic-bezier(0.32,0.72,0,1)] md:select-none">
              <Search
                searchValue={searchValue()}
                setSearchValue={setSearchValue}
                result={result()}
                setResult={setResult}
                closeSearch={() => props.setOpen(false)}
              />
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer>
  )
}

export default SearchDrawer
