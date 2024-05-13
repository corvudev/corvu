import {
  type Accessor,
  createSignal,
  type Setter,
  type Signal,
  untrack,
} from 'solid-js'
import { isFunction } from '@src/index'

/**
 * Creates a simple reactive state with a getter and setter. Can be controlled by providing your own state through the `value` prop.
 * @param props.value - Controlled value of the state.
 * @param props.initialValue - Initial value of the state.
 * @param props.onChange - Callback fired when the value changes.
 * @returns ```typescript
 * [state: Accessor<T>, setState: Setter<T>]
 * ```
 */
function createControllableSignal<T>(props: {
  value?: Accessor<T | undefined>
  onChange?: (value: T) => void
}): Signal<T | undefined>
function createControllableSignal<T>(props: {
  value?: Accessor<T | undefined>
  initialValue: T
  onChange?: (value: T) => void
}): Signal<T>
function createControllableSignal<T>(props: {
  value?: Accessor<T | undefined>
  initialValue?: T
  onChange?: (value: T) => void
}): Signal<T | undefined> {
  const [uncontrolledSignal, setUncontrolledSignal] = createSignal(
    props.initialValue,
  )

  const isControlled = () => props.value?.() !== undefined
  const value = () =>
    isControlled() ? (props.value?.() as T) : uncontrolledSignal()

  const setValue: Setter<T | undefined> = (next?: unknown) => {
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
