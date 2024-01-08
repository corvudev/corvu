import { createEffect, onCleanup } from 'solid-js'
import { access } from '@lib/utils'
import type { MaybeAccessor } from 'src'

/**
 * Modifies the given element's style and reverts it back to its original style when `onCleanup` is called.
 *
 * @param props.element - The element to modify the style of.
 * @param props.style - Styles to apply to the element.
 * @param props.properties - Properties to set on the element's style.
 * @param props.cleanup - A callback to call after the style is reverted back to its original style.
 */
const createStyle = (props: {
  element: HTMLElement
  style?: MaybeAccessor<Partial<CSSStyleDeclaration>>
  properties?: MaybeAccessor<{ key: string; value: string }[]>
  cleanup?(): void
}) => {
  createEffect(() => {
    const style = access(props.style) ?? {}
    const properties = access(props.properties) ?? []

    const originalStyles = (
      Object.keys(style) as (keyof CSSStyleDeclaration)[]
    ).map((key) => {
      return [key, props.element.style[key]]
    })

    Object.assign(props.element.style, props.style)

    for (const property of properties) {
      props.element.style.setProperty(property.key, property.value)
    }

    onCleanup(() => {
      originalStyles.forEach((originalStyle) => {
        props.element.style[originalStyle[0] as never] =
          originalStyle[1] as never
      })
      for (const property of properties) {
        props.element.style.removeProperty(property.key)
      }

      if (props.element.style.length === 0) {
        props.element.removeAttribute('style')
      }
      props.cleanup?.()
    })
  })
}

export default createStyle
