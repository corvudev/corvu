import { createEffect, createSignal, onCleanup } from 'solid-js'
import Search, { type SearchResult } from '@components/docs/search/Search'
import clsx from 'clsx'
import Dialog from '@corvu/dialog'

const SearchDialog = () => {
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

  createEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        setOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })
  })

  return (
    <Dialog
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
          <Dialog.Trigger class="group hidden items-center rounded-md border border-corvu-200 bg-corvu-bg px-2 py-1.5 transition-colors hover:bg-corvu-100 md:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 256 256"
              class="size-5"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
            <span class="ml-1 text-sm">Search</span>
            <kbd class="ml-1 min-w-6 rounded-sm border border-corvu-200 bg-corvu-100 px-1 pb-px pt-1 text-center font-mono text-xs transition-colors group-hover:border-corvu-300 group-hover:bg-corvu-200 ">
              ⌘K
            </kbd>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content class="fixed bottom-auto left-1/2 top-14 z-50 w-full max-w-137 -translate-x-1/2 overflow-hidden rounded-lg border border-corvu-200 bg-corvu-bg pt-4 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-99% data-open:slide-in-from-top-20% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-99% data-closed:slide-out-to-top-20%">
              <Search
                searchValue={searchValue()}
                setSearchValue={setSearchValue}
                result={result()}
                setResult={setResult}
                closeSearch={() => props.setOpen(false)}
              />
              <div class="items-center border-t border-corvu-200 bg-corvu-100 px-4 py-2 text-sm ">
                <KeyboardShortcut key="↩" />
                <span class="ml-1">select</span>
                <KeyboardShortcut key="↑/↓" class="ml-3" />
                <span class="ml-1">prev/next</span>
                <KeyboardShortcut key="esc" class="ml-3" />
                <span class="ml-1">exit</span>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </>
      )}
    </Dialog>
  )
}

const KeyboardShortcut = (props: { key: string; class?: string }) => {
  return (
    <kbd
      class={clsx(
        'min-w-6 rounded-sm border border-corvu-300 bg-corvu-200 px-1 pb-px pt-1 text-center font-mono text-xs',
        props.class,
      )}
    >
      {props.key}
    </kbd>
  )
}

export default SearchDialog
