export type Disposer = {
  (): void
  register: (key: string, dispose: () => void) => void
  unregister: (key: string) => void
}

/** Creates a disposer where dispose functions can be registered and called at once. */
const createDisposer = (): Disposer => {
  const disposeFunctions: Array<[string, () => void]> = []
  const disposer = () => {
    disposeFunctions.forEach((dispose) => dispose[1]())
  }
  disposer.register = (key: string, dispose: () => void) => {
    disposeFunctions.push([key, dispose])
  }
  disposer.unregister = (key: string) => {
    const index = disposeFunctions.findIndex((dispose) => dispose[0] === key)
    if (index !== -1) {
      disposeFunctions.splice(index, 1)
    }
  }
  return disposer
}

export default createDisposer
