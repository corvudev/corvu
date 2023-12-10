import { createMemo, createRoot } from 'solid-js'
import type { Accessor } from 'solid-js'

/** Creates a memoized signal when called for the first time. Its wrapped inside `createRoot` so it doesn't get cleaned up when the parent owner gets disposed. */
const createOnceRoot = <T>(fn: () => T) => {
  let result: Accessor<T>
  let called = false
  return () => {
    if (called) {
      return result
    } else {
      called = true
      // eslint-disable-next-line solid/reactivity
      return (result = createRoot((_dispose) => createMemo(fn)))
    }
  }
}

export default createOnceRoot
