<div align="center">
  <a href="https://corvu.dev/docs/utilities/list">
    <img src="https://corvu.dev/readme/solid-list.png" width=1000 alt="Solid List" />
  </a>
</div>
<br />

SolidJS utility to create accessible, keyboard navigable lists like search results, selects or autocompletes.

## Features

- Vertical and horizontal lists
- Utilities for both single and multi select lists
- Supports both rtl and ltr text directions
- Is unopinonated and works with any kind of lists, even virtual lists
- Optionally loops, vim mode and handles tab key

## Usage

Import the `createList` utility and attach your list to it. This example shows how a simple search list could look like.

```tsx
import { createList } from 'solid-list'
```

```tsx
const Search = () => {
  const [results, setResults] = createSignal([])

  const { active, setActive, onKeyDown } = createList({
    items: () => results().map(result => result.id), // required
    initialActive: null, // default, T | null
    orientation: 'vertical', // default, 'vertical' | 'horizontal'
    loop: true, // default
    textDirection: 'ltr', // default, 'ltr' | 'rtl'
    handleTab: false, // default = true
    vimMode: false, // default
    onActiveChange: (active) => {} // optional callback to handle changes
  })

  return (
    <>
      <input onKeyDown={onKeyDown} />
      <For each={result}>
        {(item, index) => (
            <a href={result.href} aria-selected={active() === index()}>{result.name}<a>
        )}
      </For>
    </>
  )
}
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [List](https://corvu.dev/docs/utilities/list).
