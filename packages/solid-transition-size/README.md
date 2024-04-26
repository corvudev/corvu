<div align="center">
  <a href="https://corvu.dev/docs/utilities/transition-size">
    <img src="https://corvu.dev/readme/solid-transition-size.png" width=1000 alt="Solid Transition Size" />
  </a>
</div>
<br />

SolidJS utility which makes it possible to transition the width and height of elements that don't have a fixed size applied.

## Features

- Works with any CSS transition configuration
- Specify which dimension to observe (width, height, or both)
- Uses a ResizeObserver to detect changes in the size of the element

## Usage

The utility returns two signals: `transitioning` and `transitionSize`. `transitioning` can be used to know when the transition is happening, and `transitionSize` returns the fixed size of the element while transitioning. You **have** to use it to style the element you want to transition.

```tsx
import createTransitionSize from 'solid-transition-size';
```

For a very simple example we can take the `<details>` element and transition the height when it is toggled:
```tsx
const Details = () => {
  const [ref, setRef] = createSignal<HTMLElement | null>(null)
  const { transitionSize } = createTransitionSize({
    element: ref,
    dimension: 'height',
  })

  const height = () => {
    if (!transitionSize()) return undefined
    return transitionSize() + 'px'
  }

  return (
    <details
      ref={setRef}
      class="transition-[height]"
      style={{
        height: height(),
      }}
    >
      <summary>Show detail</summary>
      Detail
    </details>
  )
}
```

## Further Reading
This utility is from the maintainers of [corvu](https://corvu.dev), a collection of unstyled, accessible and customizable UI primitives for SolidJS. It is also documented in the corvu docs under [Transition Size](https://corvu.dev/docs/utilities/transition-size).
