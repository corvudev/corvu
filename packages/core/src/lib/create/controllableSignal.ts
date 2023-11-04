import { isFunction } from '@lib/assertions'
import { access } from '@lib/utils'
import { createSignal, untrack } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'
import type { Accessor, Setter } from 'solid-js'

const createControllableSignal = <T>(props: {
  value?: Accessor<T | undefined>
  defaultValue: MaybeAccessor<T>
  onChange?: Setter<T>
}) => {
  const [uncontrolledSignal, setUncontrolledSignal] = createSignal(
    access(props.defaultValue) as T,
  )

  const isControlled = () => props.value?.() !== undefined
  const value = () =>
    isControlled() ? (props.value?.() as T) : uncontrolledSignal()

  const setValue = (next: Exclude<T, Function> | ((prev: T) => T)) => {
    untrack(() => {
      let nextValue: Exclude<T, Function>
      if (isFunction(next)) {
        nextValue = next(value()) as Exclude<T, Function>
      } else {
        nextValue = next
      }

      if (!Object.is(nextValue, value())) {
        if (!isControlled()) {
          setUncontrolledSignal(nextValue)
        }
        props.onChange?.(nextValue)
      }
    })
  }

  return [value, setValue] as const
}

export default createControllableSignal
