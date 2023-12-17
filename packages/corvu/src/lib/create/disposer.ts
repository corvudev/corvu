export type Disposer = {
  (): void
  register(dispose: () => void): void
}

/** Creates a disposer where dispose functions can be registered and called at once. */
const createDisposer = (): Disposer => {
  const disposeFunctions: Array<() => void> = []
  const disposer = () => {
    disposeFunctions.forEach((dispose) => dispose())
  }
  disposer.register = (dispose: () => void) => {
    disposeFunctions.push(dispose)
  }
  return disposer
}

export default createDisposer
