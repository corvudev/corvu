import { createEffect, For, on, Show } from 'solid-js'
import createList from 'solid-list'
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

const Search = (props: {
  searchValue: string
  setSearchValue: (searchValue: string) => void
  result: SearchResult | null
  setResult: (result: SearchResult | null) => void
  closeSearch: () => void
}) => {
  const { selected, setSelected, onKeyDown } = createList({
    initialSelected: 0,
    itemCount: () =>
      props.result
        ? Object.values(props.result).flatMap((items) => items).length
        : 0,
    handleTab: false,
  })

  createEffect(
    on(
      () => props.result,
      () => {
        setSelected(0)
      },
    ),
  )

  createEffect(() => {
    if (!props.searchValue) return props.setResult(null)
    const fetchResults = async () => {
      const fetchedResults = await fetch(
        `${import.meta.env.PUBLIC_SEARCH_API_URL}?q=${props.searchValue}&per_page=6&query_by=hierarchy.lvl0,hierarchy.lvl1,hierarchy.lvl2,hierarchy.lvl3,content&group_by=url&group_limit=1&prioritize_num_matching_fields=false&x-typesense-api-key=${import.meta.env.PUBLIC_SEARCH_API_KEY}`,
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
      props.setResult(result)
    }
    fetchResults()
  })

  return (
    <div class="flex h-full flex-col">
      <div class="relative mx-4">
        <input
          placeholder="Search docs"
          aria-label="Search docs"
          spellcheck={false}
          value={props.searchValue}
          class="w-full rounded border border-corvu-200 bg-corvu-bg px-3 py-2 ring-2 ring-corvu-400 focus-visible:border focus-visible:border-corvu-200 focus-visible:ring-2 focus-visible:ring-corvu-400"
          onInput={(e) =>
            props.setSearchValue((e.target as HTMLInputElement).value)
          }
          onFocus={() => setSelected(0)}
          onBlur={() => setSelected(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (!props.result) return
              const resultArray = Object.values(props.result).flatMap(
                (items) => items,
              )
              window.location.href = resultArray[selected()!].pathname
              props.closeSearch()
              return
            }
            onKeyDown(e)
          }}
        />
        <Show when={props.searchValue}>
          <button
            class="absolute inset-y-0 right-0 p-2"
            onClick={() => props.setSearchValue('')}
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
      <div class="mt-1 grow space-y-2 overflow-y-auto px-4 pb-3 pt-2 scrollbar-thin">
        <Show
          when={
            props.searchValue &&
            props.result &&
            Object.keys(props.result).length === 0
          }
        >
          <p class="mt-2 text-center text-sm">
            No results for "<span class="font-bold">{props.searchValue}</span>"
          </p>
          <p class="!mb-2 !mt-5 text-center text-sm">
            Believe this query should return results?{' '}
            <a
              href={`https://github.com/corvudev/corvu/issues/new?title=[Docs] Missing+results+for+query+%22${props.searchValue}%22`}
              target="_blank"
              class="text-corvu-link underline md:hover:text-corvu-link-hover"
            >
              Let us know
            </a>
            .
          </p>
        </Show>
        <Show when={props.result}>
          {(result) => (
            <For each={Object.entries(result())}>
              {([title, items]) => (
                <div class="overflow-hidden rounded-md">
                  <p class="bg-corvu-200 p-2 text-sm font-bold">{title}</p>
                  <For each={items}>
                    {(item) => {
                      const itemIndex = Object.values(result())
                        .flatMap((items) => items)
                        .findIndex((i) => i === item)

                      return (
                        <SearchItem
                          item={item}
                          onMouseMove={() => setSelected(itemIndex)}
                          isActive={itemIndex === selected()}
                          closeSearch={props.closeSearch}
                        />
                      )
                    }}
                  </For>
                </div>
              )}
            </For>
          )}
        </Show>
      </div>
    </div>
  )
}

export default Search
