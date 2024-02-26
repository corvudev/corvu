import type { MaybeAccessor, MaybeAccessorValue } from '@src/types'

const access = <T extends MaybeAccessor<unknown>>(
  v: T,
): MaybeAccessorValue<T> => (typeof v === 'function' ? v() : v)

const afterPaint = (fn: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(fn))

export { access, afterPaint }
