type MaybeAccessor<T> = T | (() => T)
type MaybeAccessorValue<T extends MaybeAccessor<unknown>> =
  T extends () => unknown ? ReturnType<T> : T

export type { MaybeAccessor, MaybeAccessorValue }
