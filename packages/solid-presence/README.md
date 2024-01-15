<div align="center">
  <img src="https://raw.githubusercontent.com/corvudev/corvu/main/assets/solid-presence.png" width=1000 alt="Solid Presence" />
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
This utility is a re-export of the `createPresence` function from [corvu](https://corvu.dev). For more information, see [Presence](https://corvu.dev/docs/utilities/presence) in the corvu docs.
