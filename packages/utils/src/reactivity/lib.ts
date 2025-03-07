/**!
 * Part of this code is taken from and inspired by solid-primitives.
 * MIT License, Copyright (c) Solid Core Team
 *
 * https://github.com/solidjs-community/solid-primitives
 */
import type { MaybeAccessor, MaybeAccessorValue } from '@src/reactivity'
import { type Accessor } from 'solid-js'

const access = <T extends MaybeAccessor<unknown>>(
  v: T,
): MaybeAccessorValue<T> =>
  typeof v === 'function' ? v() : (v as MaybeAccessorValue<T>)

const chain = <Args extends [] | unknown[]>(callbacks: {
  [Symbol.iterator]: () => IterableIterator<
    ((...args: Args) => unknown) | undefined
  >
}): ((...args: Args) => void) => {
  return (...args: Args) => {
    for (const callback of callbacks) callback && callback(...args)
  }
}

const mergeRefs = <T>(
  ...refs: (T | ((val: T) => void) | undefined)[]
): ((el: T) => void) => {
  return chain(refs as ((el: T) => void)[])
}

const some = (...signals: Accessor<unknown>[]) => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return signals.some((signal) => !!signal())
}

export { access, chain, mergeRefs, some }
