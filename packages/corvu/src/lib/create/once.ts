import { createMemo } from 'solid-js'
import type { Accessor } from 'solid-js'

/** Creates a memoized signal when called for the first time. */
const createOnce = <T>(fn: () => T) => {
  let result: Accessor<T>
  let called = false
  return () => {
    if (called) {
      return result
    } else {
      called = true
      // eslint-disable-next-line solid/reactivity
      return (result = createMemo(fn))
    }
  }
}

export default createOnce
