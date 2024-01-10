<div align="center">
  <img src="https://raw.githubusercontent.com/corvudev/corvu/main/assets/solid-focus-trap.png" width=1000 alt="Solid Focus Trap" />
</div>
<br />

SolidJS utility that traps focus inside a given DOM element.

## Features

- Watches for DOM changes inside the focus trap and updates accordingly
- Properly restores focus when the trap gets disabled
- Very customizable

## Usage

```tsx
import createFocusTrap from 'solid-focus-trap'
```

```tsx
const DialogContent: Component<{
  open: boolean
}> = (props) => {
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)

  createFocusTrap({
    element: contentRef,
    enabled: () => props.open, // default = true
    observeChanges: true, // default
    restoreFocus: true, // default
  })

  return (
    <Show when={props.open}>
      <div ref={setContentRef}>Dialog</div>
    </Show>
  )
}
```

The first focusable element within the focus trap element will be focused initially. When the trap is disabled, the focus will be restored to the element that was focused before the trap was enabled.

### Custom initial focus element
This example shows how to customize the initial focus element so that the focus moves to a specific element when the trap gets enabled.

```tsx
const DialogContent: Component<{
  open: boolean
}> = (props) => {
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)
  const [initialFocusRef, setInitialFocusRef] =
    createSignal<HTMLElement | null>(null)

  createFocusTrap({
    element: contentRef,
    enabled: () => props.open,
    initialFocusElement: initialFocusRef,
  })

  return (
    <Show when={props.open}>
      <div ref={setContentRef}>Dialog</div>
      <button>Close</button>
      <input ref={setInitialFocusRef} />
    </Show>
  )
}
```

## Further Reading
This utility is a re-export of the `createFocusTrap` function from [corvu](https://corvu.dev). For more information, see [Focus Trap](https://corvu.dev/docs/utilities/focus-trap) in the corvu docs.
