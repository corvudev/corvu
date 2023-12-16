import { isFunction } from '@lib/assertions'
import { createSignal, untrack } from 'solid-js'
import type { Accessor, Setter, Signal } from 'solid-js'

/** Creates a simple reactive state with a getter and setter. Can be controlled by providing your own state through the `value` prop. */
const createControllableSignal = <T>(props: {
  /** Optionally provide your own state to use. */
  value?: Accessor<T | undefined>
  /** Default value of the signal. */
  defaultValue: T
  /** Callback fired when the value changes. */
  onChange?(value: T): void
}): Signal<T> => {
  const [uncontrolledSignal, setUncontrolledSignal] = createSignal(
    props.defaultValue,
  )

  const isControlled = () => props.value?.() !== undefined
  const value = () =>
    isControlled() ? (props.value?.() as T) : uncontrolledSignal()

  const setValue: Setter<T> = (next?: unknown) => {
    return untrack(() => {
      let nextValue: Exclude<T, Function>
      if (isFunction(next)) {
        nextValue = next(value()) as Exclude<T, Function>
      } else {
        nextValue = next as Exclude<T, Function>
      }

      if (!Object.is(nextValue, value())) {
        if (!isControlled()) {
          setUncontrolledSignal(nextValue)
        }
        props.onChange?.(nextValue)
      }
      return nextValue as never
    })
  }

  return [value, setValue]
}

export default createControllableSignal
