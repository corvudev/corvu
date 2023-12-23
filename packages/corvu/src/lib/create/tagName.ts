import { type Accessor, createMemo } from 'solid-js'

const createTagName = (props: {
  element: Accessor<HTMLElement | null>
  fallback: string
}) => {
  const tagName = createMemo(
    () => props.element()?.tagName.toLowerCase() || props.fallback,
  )

  return tagName
}

export default createTagName
