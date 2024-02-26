import { access, type MaybeAccessor } from '@corvu/utils'
import { createMemo, createSignal, mergeProps } from 'solid-js'

/**
 * Manages keyboard navigation between elements.
 *
 * @param props.loop - Whether to loop keyboard navigation when the first or last element is reached. *Default = `true`*
 * @param props.orientation - The orientation of the elements. *Default = `'vertical'`*
 * @returns ```typescript
 * {
 *   register: (element: HTMLElement) => void,
 *   unregister: (element: HTMLElement) => void,
 *   onKeyDown: (event: KeyboardEvent) => void,
 * }
 * ```
 */
const createNavigation = (props: {
  loop?: MaybeAccessor<boolean>
  orientation?: MaybeAccessor<'vertical' | 'horizontal'>
}) => {
  const defaultedProps = mergeProps(
    { loop: true, orientation: 'vertical' as const },
    props,
  )

  const [elements, setElements] = createSignal<HTMLElement[]>([])

  const sortedElements = createMemo(() => {
    return elements()
      .filter((element) => !element.hasAttribute('disabled'))
      .sort((a, b) => {
        const relativePosition = a.compareDocumentPosition(b)
        if (
          relativePosition & Node.DOCUMENT_POSITION_PRECEDING ||
          relativePosition & Node.DOCUMENT_POSITION_CONTAINS
        ) {
          return 1
        }
        if (
          relativePosition & Node.DOCUMENT_POSITION_FOLLOWING ||
          relativePosition & Node.DOCUMENT_POSITION_CONTAINED_BY
        ) {
          return -1
        }
        return 0
      })
  })

  const register = (element: HTMLElement) => {
    setElements((elements) => [...elements, element])
  }

  const unregister = (element: HTMLElement) => {
    setElements((elements) => elements.filter((e) => e !== element))
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const textDirection = window.getComputedStyle(target).direction as
      | 'ltr'
      | 'rtl'

    const _sortedElements = sortedElements()
    if (_sortedElements.length < 2) return

    const firstElement = _sortedElements[0] as HTMLElement
    const lastElement = _sortedElements[
      _sortedElements.length - 1
    ] as HTMLElement

    if (
      getNextKey(access(defaultedProps.orientation), textDirection) ===
      event.key
    ) {
      event.preventDefault()
      const index = _sortedElements.indexOf(target)
      if (index === _sortedElements.length - 1) {
        if (access(defaultedProps.loop)) {
          firstElement.focus()
        }
      } else {
        _sortedElements[index + 1]!.focus()
      }
      return
    }

    if (
      getPreviousKey(access(defaultedProps.orientation), textDirection) ===
      event.key
    ) {
      event.preventDefault()
      const index = _sortedElements.indexOf(target)
      if (index === 0) {
        if (access(defaultedProps.loop)) {
          lastElement.focus()
        }
      } else {
        _sortedElements[index - 1]!.focus()
      }
      return
    }

    if (event.key === 'Home') {
      event.preventDefault()
      if (firstElement !== target) {
        firstElement.focus()
      }
      return
    }

    if (event.key === 'End') {
      event.preventDefault()
      if (lastElement !== target) {
        lastElement.focus()
      }
      return
    }
  }

  return {
    register,
    unregister,
    onKeyDown,
  }
}

const getNextKey = (
  direction: 'vertical' | 'horizontal',
  textDirection: 'ltr' | 'rtl',
) => {
  if (direction === 'vertical') {
    return 'ArrowDown'
  }
  return textDirection === 'ltr' ? 'ArrowRight' : 'ArrowLeft'
}

const getPreviousKey = (
  direction: 'vertical' | 'horizontal',
  textDirection: 'ltr' | 'rtl',
) => {
  if (direction === 'vertical') {
    return 'ArrowUp'
  }
  return textDirection === 'ltr' ? 'ArrowLeft' : 'ArrowRight'
}

export default createNavigation
