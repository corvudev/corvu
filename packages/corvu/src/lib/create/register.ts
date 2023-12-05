import { createMemo, createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'

/** Creates a memo which can be registered/unregistered with the returned `register` and `unregister` functions. */
const createRegister = <T>(
  value: Accessor<T | undefined>,
  initialRegistered = false,
) => {
  const [isRegistered, setIsRegistered] = createSignal(initialRegistered)
  const registerable = createMemo<T | undefined>(() => {
    if (!isRegistered()) return undefined
    return value()
  })

  return [
    registerable,
    () => {
      setIsRegistered(true)
    },
    () => {
      setIsRegistered(false)
    },
  ] as const
}

export default createRegister
