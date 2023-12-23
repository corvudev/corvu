import { onCleanup } from 'solid-js'

const createStyle = (
  element: HTMLElement,
  style: Partial<CSSStyleDeclaration>,
  cleanup?: () => void,
) => {
  const originalStyles = (
    Object.keys(style) as (keyof CSSStyleDeclaration)[]
  ).map((key) => {
    return [key, element.style[key]]
  })

  Object.assign(element.style, style)

  onCleanup(() => {
    originalStyles.forEach((originalStyle) => {
      element.style[originalStyle[0] as never] = originalStyle[1] as never
    })
    if (element.style.length === 0) {
      element.removeAttribute('style')
    }
    cleanup?.()
  })
}

export default createStyle
