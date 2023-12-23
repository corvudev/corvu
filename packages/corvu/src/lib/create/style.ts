import { createEffect, onCleanup } from 'solid-js'

const createStyle = (props: {
  element: HTMLElement
  style: Partial<CSSStyleDeclaration>
  cleanup?: () => void
}) => {
  createEffect(() => {
    const originalStyles = (
      Object.keys(props.style) as (keyof CSSStyleDeclaration)[]
    ).map((key) => {
      return [key, props.element.style[key]]
    })

    Object.assign(props.element.style, props.style)

    onCleanup(() => {
      originalStyles.forEach((originalStyle) => {
        props.element.style[originalStyle[0] as never] =
          originalStyle[1] as never
      })
      if (props.element.style.length === 0) {
        props.element.removeAttribute('style')
      }
      props.cleanup?.()
    })
  })
}

export default createStyle
