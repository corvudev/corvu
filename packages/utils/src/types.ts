type MaybeAccessor<T> = T | (() => T)

type MaybeAccessorValue<T extends MaybeAccessor<unknown>> =
  T extends () => unknown ? ReturnType<T> : T

type Axis = 'x' | 'y'

export type { MaybeAccessor, Axis, MaybeAccessorValue }
