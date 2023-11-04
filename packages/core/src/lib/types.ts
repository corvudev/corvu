import type { ComponentProps, ValidComponent } from 'solid-js'

export type OverrideComponentProps<
  T extends ValidComponent,
  O,
  P = ComponentProps<T>,
> = OverrideProps<
  {
    [K in keyof P]: P[K]
  },
  O
>

type OverrideProps<T, P> = Omit<T, keyof P> & P

export type MaybeAccessor<T> = T | (() => T)

export type MaybeAccessorValue<T extends MaybeAccessor<unknown>> =
  T extends () => unknown ? ReturnType<T> : T
