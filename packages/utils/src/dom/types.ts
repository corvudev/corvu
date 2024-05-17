type EventHandlerEvent<T, E extends Event> = E & {
  currentTarget: T
  target: Element
}

type ElementOf<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any

type Ref<T> = T | ((element: T) => void)

export type { EventHandlerEvent, ElementOf, Ref }
