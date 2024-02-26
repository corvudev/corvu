import { createEffect, onCleanup } from 'solid-js'
import { access } from '@src/utils'
import type { MaybeAccessor } from '@src/types'

const activeStyles = new Map<
  string,
  {
    activeCount: number
    originalStyles: Partial<CSSStyleDeclaration>
    properties: string[]
  }
>()

/**
 * Modifies the given element's style and reverts it back to its original style when `onCleanup` is called.
 *
 * @param props.key - Styles with the same key will be tracked together and only reverted once all of them are cleaned up.
 * @param props.element - The element to modify the style of.
 * @param props.style - Styles to apply to the element.
 * @param props.properties - Properties to set on the element's style.
 * @param props.cleanup - A callback to call after the style is reverted back to its original style.
 */
const createStyle = (props: {
  key: string
  element: HTMLElement
  style?: MaybeAccessor<Partial<CSSStyleDeclaration>>
  properties?: MaybeAccessor<{ key: string; value: string }[]>
  cleanup?: () => void
}) => {
  createEffect(() => {
    const style = access(props.style) ?? {}
    const properties = access(props.properties) ?? []

    const originalStyles: Partial<CSSStyleDeclaration> = {}
    for (const key in style) {
      originalStyles[key] = props.element.style[key]
    }

    const activeStyle = activeStyles.get(props.key)
    if (activeStyle) {
      activeStyle.activeCount++
    } else {
      activeStyles.set(props.key, {
        activeCount: 1,
        originalStyles,
        properties: properties.map((property) => property.key),
      })
    }

    Object.assign(props.element.style, props.style)

    for (const property of properties) {
      props.element.style.setProperty(property.key, property.value)
    }

    onCleanup(() => {
      const activeStyle = activeStyles.get(props.key)
      if (!activeStyle) return
      if (activeStyle.activeCount !== 1) {
        activeStyle.activeCount--
        return
      }
      activeStyles.delete(props.key)

      for (const [key, value] of Object.entries(activeStyle.originalStyles)) {
        // @ts-expect-error: `key` is valid in this context.
        props.element.style[key] = value
      }

      for (const property of activeStyle.properties) {
        props.element.style.removeProperty(property)
      }

      if (props.element.style.length === 0) {
        props.element.removeAttribute('style')
      }
      props.cleanup?.()
    })
  })
}

export default createStyle
