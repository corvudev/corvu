type EventHandlerEvent<T, E extends Event> = E & {
  currentTarget: T
  target: Element
}

export type { EventHandlerEvent }
