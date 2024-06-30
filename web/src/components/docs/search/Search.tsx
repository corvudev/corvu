import { createEffect, For, Show } from 'solid-js'
import createNavigation from '@components/docs/search/createNavigation'
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
  const { onKeyDown, onMouseMove, activeIndex } = createNavigation({
    resultCount: () =>
      props.result
        ? Object.values(props.result).flatMap((items) => items).length
        : 0,
    onSelect: (index) => {
      if (!props.result) return
      props.closeSearch()
      const resultArray = Object.values(props.result).flatMap((items) => items)
      window.location.href = resultArray[index].pathname
    },
  })

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
          onKeyDown={onKeyDown}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 256 256"
            class="mx-auto mt-2 size-12"
          >
            <path d="M224.42,104.2c-3.9-4.07-7.93-8.27-9.55-12.18-1.5-3.63-1.58-9-1.67-14.68-.14-9.38-.3-20-7.42-27.12S188,42.94,178.66,42.8c-5.68-.09-11-.17-14.68-1.67-3.91-1.62-8.11-5.65-12.18-9.55C145.16,25.22,137.64,18,128,18s-17.16,7.22-23.8,13.58c-4.07,3.9-8.27,7.93-12.18,9.55-3.63,1.5-9,1.58-14.68,1.67-9.38.14-20,.3-27.12,7.42S42.94,68,42.8,77.34c-.09,5.68-.17,11-1.67,14.68-1.62,3.91-5.65,8.11-9.55,12.18C25.22,110.84,18,118.36,18,128s7.22,17.16,13.58,23.8c3.9,4.07,7.93,8.27,9.55,12.18,1.5,3.63,1.58,9,1.67,14.68.14,9.38.3,20,7.42,27.12S68,213.06,77.34,213.2c5.68.09,11,.17,14.68,1.67,3.91,1.62,8.11,5.65,12.18,9.55C110.84,230.78,118.36,238,128,238s17.16-7.22,23.8-13.58c4.07-3.9,8.27-7.93,12.18-9.55,3.63-1.5,9-1.58,14.68-1.67,9.38-.14,20-.3,27.12-7.42s7.28-17.74,7.42-27.12c.09-5.68.17-11,1.67-14.68,1.62-3.91,5.65-8.11,9.55-12.18C230.78,145.16,238,137.64,238,128S230.78,110.84,224.42,104.2Zm-8.66,39.3c-4.67,4.86-9.5,9.9-12,15.9-2.38,5.74-2.48,12.52-2.58,19.08-.11,7.44-.23,15.14-3.9,18.82s-11.38,3.79-18.82,3.9c-6.56.1-13.34.2-19.08,2.58-6,2.48-11,7.31-15.91,12-5.25,5-10.68,10.24-15.49,10.24s-10.24-5.21-15.5-10.24c-4.86-4.67-9.9-9.5-15.9-12-5.74-2.38-12.52-2.48-19.08-2.58-7.44-.11-15.14-.23-18.82-3.9s-3.79-11.38-3.9-18.82c-.1-6.56-.2-13.34-2.58-19.08-2.48-6-7.31-11-12-15.91C35.21,138.24,30,132.81,30,128s5.21-10.24,10.24-15.5c4.67-4.86,9.5-9.9,12-15.9,2.38-5.74,2.48-12.52,2.58-19.08.11-7.44.23-15.14,3.9-18.82s11.38-3.79,18.82-3.9c6.56-.1,13.34-.2,19.08-2.58,6-2.48,11-7.31,15.91-12C117.76,35.21,123.19,30,128,30s10.24,5.21,15.5,10.24c4.86,4.67,9.9,9.5,15.9,12,5.74,2.38,12.52,2.48,19.08,2.58,7.44.11,15.14.23,18.82,3.9s3.79,11.38,3.9,18.82c.1,6.56.2,13.34,2.58,19.08,2.48,6,7.31,11,12,15.91,5,5.25,10.24,10.68,10.24,15.49S220.79,138.24,215.76,143.5ZM138,180a10,10,0,1,1-10-10A10,10,0,0,1,138,180Zm28-72c0,16.92-13.89,31-32,33.58V144a6,6,0,0,1-12,0v-8a6,6,0,0,1,6-6c14.34,0,26-9.87,26-22s-11.66-22-26-22-26,9.87-26,22v4a6,6,0,0,1-12,0v-4c0-18.75,17-34,38-34S166,89.25,166,108Z" />
          </svg>
          <p class="text-center text-sm">
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
                          onMouseMove={() => onMouseMove(itemIndex)}
                          isActive={itemIndex === activeIndex()}
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
