import type { ComponentProps, ValidComponent } from 'solid-js'

export type OverrideComponentProps<
  T extends ValidComponent,
  Props,
> = OverrideProps<ComponentProps<T>, Props>

export type OverrideProps<T, P> = Omit<T, keyof P> & P

export type Side = 'top' | 'right' | 'bottom' | 'left'

export type EventHandlerEvent<T, E extends Event> = E & {
  currentTarget: T
  target: Element
}
