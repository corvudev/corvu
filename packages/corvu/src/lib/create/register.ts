import { createMemo, createSignal, mergeProps } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from '@lib/types'

/** Creates a memo which can be registered/unregistered with the returned `register` and `unregister` functions. */
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
