<div align="center">
  <a href="https://corvu.dev/docs/utilities/presence">
    <img src="https://corvu.dev/readme/solid-presence.png" width=1000 alt="Solid Presence" />
  </a>
</div>
<br />

SolidJS utility that manages the presence of an element in the DOM while being aware of pending animations.

## Usage

The utility returns a boolean called `present` which indicates if the element should be present in the DOM or not.

The `state` variable can be used to get the current state of the presence. Valid states are `present`, `hiding` or `hidden`.

```tsx
import createPresence from 'solid-presence'
```

```tsx
const DialogContent: Component<{
  open?: boolean
}> = (props) => {
  const [dialogRef, setDialogRef] = createSignal<HTMLElement | null>(null)

  const { present } = createPresence({
    show: () => props.open,
    element: dialogRef,
  })

  return (
    <Show when={present()}>
      <div ref={setDialogRef}>Dialog</div>
    </Show>
  )
}
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [Presence](https://corvu.dev/docs/utilities/presence).
