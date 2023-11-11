import { MaybeAccessor } from '@lib/types'
import { access, sleep } from '@lib/utils'
import { createSignal, type Accessor, createEffect, onCleanup } from 'solid-js'

const focusableElementSelector =
  'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

const createFocusTrap = (props: {
  element: Accessor<HTMLElement | null>
  initialFocusElement?: MaybeAccessor<HTMLElement | null>
  isDisabled?: MaybeAccessor<boolean>
  restoreFocus?: MaybeAccessor<boolean>
  finalFocusElement?: MaybeAccessor<HTMLElement | null>
}) => {
  const [firstFocusElement, setFirstFocusElement] =
    createSignal<HTMLElement | null>(null)
  const [lastFocusElement, setLastFocusElement] =
    createSignal<HTMLElement | null>(null)

  let initialFocusRun = false

  let originalFocusedElement: HTMLElement | null = null

  createEffect(() => {
    const elementRef = props.element()
    if (!elementRef || access(props.isDisabled)) {
      restoreFocus()
      return
    }

    scanElements()

    const firstFocusElementRef = firstFocusElement()
    const lastFocusElementRef = lastFocusElement()

    if (firstFocusElementRef) {
      firstFocusElementRef.addEventListener(
        'keydown',
        onFirstFocusElementKeyDown,
      )
    }
    if (lastFocusElementRef) {
      lastFocusElementRef.addEventListener('keydown', onLastFocusElementKeyDown)
    }

    onCleanup(() => {
      if (firstFocusElementRef) {
        firstFocusElementRef.removeEventListener(
          'keydown',
          onFirstFocusElementKeyDown,
        )
      }
      if (lastFocusElementRef) {
        lastFocusElementRef.removeEventListener(
          'keydown',
          onLastFocusElementKeyDown,
        )
      }
    })
  })

  const scanElements = () => {
    const element = props.element()
    if (!element) {
      return []
    }

    const focusableElements = Array.from(
      element.querySelectorAll(focusableElementSelector),
    )

    setFirstFocusElement((focusableElements[0] as HTMLElement) ?? null)
    setLastFocusElement(
      (focusableElements[focusableElements.length - 1] as HTMLElement) ?? null,
    )

    if (!initialFocusRun) {
      initialFocusRun = true
      originalFocusedElement = document.activeElement as HTMLElement | null
      const initialFocusElement = access(props.initialFocusElement)

      if (initialFocusElement) {
        initialFocusElement.focus()
      } else {
        firstFocusElement()?.focus()
      }
    }

    return focusableElements
  }

  const onFirstFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusElement()?.focus()
    }
  }

  const onLastFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusElement()?.focus()
    }
  }

  const restoreFocus = () => {
    const restoreFocus = access(props.restoreFocus)
    if (!restoreFocus) return

    const finalFocusElement = access(props.finalFocusElement)

    if (finalFocusElement) {
      finalFocusElement.focus()
    } else {
      sleep(0).then(() => originalFocusedElement?.focus())
    }
  }
}

export default createFocusTrap
