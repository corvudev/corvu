import { createEffect, createSignal } from 'solid-js'

const createIsClient = () => {
  const [isClient, setIsClient] = createSignal(false)
  createEffect(() => setIsClient(true))

  return isClient
}

export default createIsClient
