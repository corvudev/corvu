import { access, type MaybeAccessor } from '@corvu/utils'
import { createMemo } from 'solid-js'

/**
 * Returns a memoized signal with the tag name of the element.
 *
 * @param props.element - The element to get the tag name of.
 * @param props.fallback - The fallback tag name to use if the element is `null`.
 * @returns ```typescript
 * Accessor<string>
 * ```
 */
const createTagName = (props: {
  element: MaybeAccessor<HTMLElement | null>
  fallback: string
}) => {
  const tagName = createMemo(
    () => access(props.element)?.tagName.toLowerCase() || props.fallback,
  )

  return tagName
}

export default createTagName
