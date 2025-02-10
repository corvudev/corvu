import { createEffect, createSignal, For, on, onCleanup, Show } from 'solid-js'
import clsx from 'clsx'
import { createList } from 'solid-list'
import Dialog from '@corvu/dialog'
import SearchItem from '@components/docs/search/SearchItem'

export type SearchResult = {
  [title: string]: SearchItemType[]
}

export type SearchItemType = {
  hierarchy: string
  content: string
  pathname: string
}

type TypeSenseResponse = {
  grouped_hits: {
    hits: {
      document: {
        'hierarchy.lvl0': string
        hierarchy_camel: string[]
        url: string
      }
      highlight: {
        content?: {
          snippet: string
        }
      }
    }[]
  }[]
}

const Search = () => {
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
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      window.removeEventListener('keydown', handleKeyDown)
    })
  })

  const { active, setActive, onKeyDown } = createList({
    items: () => {
      const _result = result()
      if (!_result) return []
      return [
        ...Array(
          Object.values(_result).flatMap((items) => items).length,
        ).keys(),
      ]
    },
    initialActive: 0,
    handleTab: false,
  })

  createEffect(
    on(result, () => {
      setActive(0)
    }),
  )

  createEffect(() => {
    const _searchValue = searchValue()
    if (!_searchValue) return setResult(null)
    const fetchResults = async () => {
      const fetchedResults = await fetch(
        `${import.meta.env.PUBLIC_SEARCH_API_URL}?q=${_searchValue}&per_page=6&query_by=hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,content&group_by=url&group_limit=1&prioritize_num_matching_fields=false&x-typesense-api-key=${import.meta.env.PUBLIC_SEARCH_API_KEY}`,
      )
      const fetchedResultsJson: TypeSenseResponse = await fetchedResults.json()
      const result = fetchedResultsJson.grouped_hits
        .flatMap((grouped_hit) => grouped_hit.hits)
        .map((hit) => {
          const hit_hierarchy = Object.values(hit.document.hierarchy_camel[0])
            .filter(Boolean)
            .map((hierarchy) => {
              hierarchy = hierarchy.replace('&lt;', '<')
              hierarchy = hierarchy.replace('&gt;', '>')
              return hierarchy
            })
          let hierarchy = ''
          if (hit_hierarchy.length === 1) {
            hierarchy = hit_hierarchy[0]
          } else {
            hierarchy += hit_hierarchy.slice(1).join(' → ')
          }
          const url = new URL(hit.document.url)
          return {
            group_title: hit.document['hierarchy.lvl0'],
            hierarchy,
            content: hit.highlight.content?.snippet,
            href: hit.document.url,
            pathname: url.pathname + url.hash,
          }
        })
        .reduce(
          (groupedResults, item) => ({
            ...groupedResults,
            [item.group_title]: [
              ...(groupedResults[item.group_title] ?? []),
              item as SearchItemType,
            ],
          }),
          {} as SearchResult,
        )
      setResult(result)
    }
    fetchResults()
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
      <Dialog.Trigger class="group items-center gap-1 md:rounded-full md:border md:border-corvu-200 md:bg-corvu-bg p-2 md:py-1 md:mr-1.5 transition-colors hover:bg-corvu-100 inline-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="md:-ml-0.5 size-5 md:size-4 md:opacity-90"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <kbd class="font-sans text-xs/4 hidden md:block macos:hidden">
          Ctrl&nbsp;K
        </kbd>
        <kbd class="hidden font-sans text-xs/4 md:macos:block">⌘K</kbd>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-50 bg-black/50 hidden data-open:animate-in data-open:fade-in-0% data-closed:animate-out data-closed:fade-out-0% md:block" />
        <Dialog.Content class="fixed inset-0 md:bottom-auto md:left-1/2 md:top-14 z-50 w-full max-w-137 md:-translate-x-1/2 overflow-hidden md:rounded-lg md:border md:border-corvu-200 bg-corvu-bg pt-4 data-open:animate-in data-open:fade-in-0% data-open:zoom-in-99% md:data-open:slide-in-from-top-10% data-closed:animate-out data-closed:fade-out-0% data-closed:zoom-out-99% md:data-closed:slide-out-to-top-10%">
          <div class="flex h-full flex-col">
            <div class="flex items-center">
              <Dialog.Close tabIndex="1" class="md:hidden px-3 py-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  class="size-5"
                >
                  <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z" />
                </svg>
              </Dialog.Close>
              <div class="grow relative mr-4 md:ml-4">
                <input
                  placeholder="Search docs"
                  aria-label="Search docs"
                  role="searchbox"
                  spellcheck={false}
                  value={searchValue()}
                  class="w-full rounded-sm border border-corvu-200 bg-corvu-bg px-3 py-2 ring-2 ring-corvu-400 focus-visible:border focus-visible:border-corvu-200 focus-visible:ring-2 focus-visible:ring-corvu-400"
                  onInput={(e) =>
                    setSearchValue((e.target as HTMLInputElement).value)
                  }
                  onFocus={() => setActive(0)}
                  onBlur={() => setActive(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const _result = result()
                      if (!_result) return
                      const resultArray = Object.values(_result).flatMap(
                        (items) => items,
                      )
                      window.location.href = resultArray[active()!].pathname
                      setOpen(false)
                      return
                    }
                    onKeyDown(e)
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
            </div>
            <div class="mt-1 grow space-y-2 overflow-y-auto px-4 pb-3 pt-2 scrollbar-thin">
              <Show
                when={
                  searchValue() &&
                  result() &&
                  Object.keys(result()!).length === 0
                }
              >
                <p class="mt-2 text-center text-sm">
                  No results for "<span class="font-bold">{searchValue()}</span>
                  "
                </p>
                <p class="pb-2 pt-5 text-center text-sm">
                  Believe this query should return results?{' '}
                  <a
                    href={`https://github.com/corvudev/corvu/issues/new?title=[Docs] Missing+results+for+query+%22${searchValue()}%22`}
                    target="_blank"
                    class="text-corvu-link underline md:hover:text-corvu-link-hover"
                  >
                    Let us know
                  </a>
                  .
                </p>
              </Show>
              <Show when={result()}>
                {(result) => (
                  <For each={Object.entries(result())}>
                    {([title, items]) => (
                      <section class="overflow-hidden rounded-md">
                        <h2 class="bg-corvu-200 p-2 text-sm font-bold">
                          {title}
                        </h2>
                        <ul role="listbox">
                          <For each={items}>
                            {(item) => {
                              const itemIndex = Object.values(result())
                                .flatMap((items) => items)
                                .findIndex((i) => i === item)

                              return (
                                <SearchItem
                                  item={item}
                                  onMouseMove={() => setActive(itemIndex)}
                                  isActive={itemIndex === active()}
                                  closeSearch={() => setOpen(false)}
                                />
                              )
                            }}
                          </For>
                        </ul>
                      </section>
                    )}
                  </For>
                )}
              </Show>
            </div>
          </div>
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

export default Search
