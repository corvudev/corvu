import { Accessor, createMemo } from 'solid-js'

const createTagName = (ref: Accessor<HTMLElement | null>, fallback: string) => {
  const tagName = createMemo(() => ref()?.tagName.toLowerCase() || fallback)

  return tagName
}

export default createTagName
