type EventHandlerEvent<T, E extends Event> = E & {
  currentTarget: T
  target: Element
}

type Ref = HTMLElement | ((element: HTMLElement) => void)

export type { EventHandlerEvent, Ref }
