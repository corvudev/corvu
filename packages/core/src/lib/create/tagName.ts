import { Accessor, createEffect, createSignal } from 'solid-js'

const createTagName = (ref: Accessor<HTMLElement | null>, fallback: string) => {
  const [tagName, setTagName] = createSignal(fallback)

  createEffect(() => {
    setTagName(ref()?.tagName.toLowerCase() || fallback)
  })

  return tagName
}

export default createTagName
