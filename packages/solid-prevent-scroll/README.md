<div align="center">
  <a href="https://corvu.dev/docs/utilities/prevent-scroll">
    <img src="https://corvu.dev/readme/solid-prevent-scroll.png" width=1000 alt="Solid Prevent Scroll" />
  </a>
</div>
<br />

SolidJS utility that prevents scrolling outside of a given DOM element. Works by preventing events that else would lead to scrolling.

## Features

- Supports nested scroll containers
- Works both vertically and horizontally
- Removes the body scrollbar without layout shift

## Usage

By default, it also hides the scrollbar of the body element and adds padding to it to prevent the page from jumping. This behavior can be disabled and modified with the `hideScrollbar`, `preventScrollbarShift`, and `preventScrollbarShiftMode` props.

It also adds the CSS variable `--scrollbar-width` to the body element, indicating the width of the currently removed scrollbar. You can use this variable to add padding to fixed elements, like a topbar.

```tsx
import createPreventScroll from 'solid-prevent-scroll'
```

```tsx
const DialogContent: Component<{
  open: boolean
}> = (props) => {
  const [ref, setRef] = createSignal(null)

  createPreventScroll({
    element: ref,
    enabled: () => props.open, // default = true
    hideScrollbar: true, // default
    preventScrollbarShift: true, // default
    preventScrollbarShiftMode: 'padding', // default, `padding` or `margin`
    restoreScrollPosition: true, // default
    allowPinchZoom: false, // default
  })

  return (
    <Show when={props.open()}>
      <div ref={setRef}>Dialog</div>
    </Show>
  )
}
```

Use the `--scrollbar-width` CSS variable to add padding to fixed elements to prevent the content from shifting when the scrollbar is removed:

```tsx
<header
  class="fixed top-0 inset-x-0 z-50"
  style={{
    'padding-right': 'var(--scrollbar-width, 0)',
  }}
>
  Header
</header>
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [Prevent Scroll](https://corvu.dev/docs/utilities/prevent-scroll).
