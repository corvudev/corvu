import { createEffect, createMemo, createRoot } from 'solid-js'
import type { Accessor } from 'solid-js'

/** Creates a memoized signal when called for the first time. Its wrapped inside `createRoot` so it doesn't get cleaned up when the parent owner gets disposed. */
const createOnceRoot = <T>(
  fn: () => T,
  registerDispose: Accessor<(dispose: () => void) => void>,
) => {
  let result: Accessor<T>
  let called = false
  return () => {
    if (called) {
      return result
    } else {
      called = true
      return (result = createRoot((dispose) => {
        createEffect(() => {
          registerDispose()(dispose)
        })
        const memoized = createMemo(fn)
        return memoized
      }))
    }
  }
}

export default createOnceRoot
