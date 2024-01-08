import { type Accessor, createMemo } from 'solid-js'

/**
 * Creates a memoized signal when called for the first time.
 * @param fn - Function to memoize.
 * @returns ```typescript
 * () => Accessor<T>
 * ```
 */
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
