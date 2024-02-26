import { access, type MaybeAccessor } from '@corvu/utils'
import { createMemo, createSignal, mergeProps } from 'solid-js'

/**
 * Creates a memo which can be registered/unregistered with the returned `register` and `unregister` functions.
 *
 * @param props.value - The value to memoize.
 * @param props.initialRegistered - Whether the value should be registered initially. *Default = `false`*
 * @returns ```typescript
 * [
 *   registerable: Accessor<T | undefined>,
 *   register: () => void,
 *   unregister: () => void
 * ]
 * ```
 * `registerable` is a memoized signal which returns the value if it is registered and `undefined` if it is not.
 */
const createRegister = <T>(props: {
  value: MaybeAccessor<T | undefined>
  initialRegistered?: boolean
}) => {
  const defaultedProps = mergeProps(
    {
      initialRegistered: false,
    },
    props,
  )

  const [isRegistered, setIsRegistered] = createSignal(
    defaultedProps.initialRegistered,
  )
  const registerable = createMemo<T | undefined>(() => {
    if (!isRegistered()) return undefined
    return access(defaultedProps.value) as T | undefined
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
