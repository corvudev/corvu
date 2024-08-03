<div align="center">
  <a href="https://corvu.dev/docs/utilities/dismissible">
    <img src="https://corvu.dev/readme/solid-dismissible.png" width=1000 alt="Solid Dismissible" />
  </a>
</div>
<br />

SolidJS utility for creating dismissible, nestable layers. Offers different strategies to dismiss the layer, such as on outside click, escape key press, or outside focus.

## Features

- Supports nested layers
- Dismiss on outside pointer down/up, outside focus or escape key
- Is headless, doesn\'t create extra DOM elements
- Every dismiss strategy can be disabled/customized
- Events can be cancelled
- Compatible with corvu primitives as they use this utility

## Usage

```tsx
import Dismissible from 'solid-dismissible'
```

```tsx
const DialogContent: Component<{
  open: boolean
  setOpen: (open: boolean) => void
}> = (props) => {
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)

  return (
    <Dismissible
      element={contentRef}
      enabled={open()}
      onDismiss={() => setOpen(false)}
    >
      <Show when={props.open()}>
        <div ref={setContentRef}>Dialog</div>
      </Show>
    </Dismissible>
  )
}
```

### Tracking active dismissibles
The utility exports a `activeDismissibles` signal that can be used to track active dismissibles. It includes an array of all currently active dismissible ids.

```tsx
import { activeDismissibles } from 'solid-dismissible'

createEffect(() => {
  console.log('Currently active dismissibles: ', activeDismissibles())
})
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [Dismissible](https://corvu.dev/docs/utilities/dismissible).
