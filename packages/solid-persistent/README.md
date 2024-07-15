<div align="center">
  <a href="https://corvu.dev/docs/utilities/persistent">
    <img src="https://corvu.dev/readme/solid-persistent.png" width=1000 alt="Solid Persistent" />
  </a>
</div>
<br />

SolidJS utility to create persistent components that keep their state and elements cached when removed from the DOM.

## Features

- Persists both JavaScript state and HTML elements
- Supports SSR

## Usage

Import the `createPersistent` utility and pass your component to it. Make sure to call the utility inside a component that doesn't unmount. Then use the returned Accessor in your JSX where it can unmount.

```tsx
import createPersistent from 'solid-persistent'
```

```tsx
const PersistedDialogContent = () => {
  const persistedContent = createPersistent(() => {
    return <input />
  })

  return (
  <Dialog>
      <Dialog.Trigger>
        Open
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          {persistedContent()}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [Persistent](https://corvu.dev/docs/utilities/persistent).
