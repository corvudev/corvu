import { MaybeAccessor } from '@lib/types'
import { access, sleep } from '@lib/utils'
import { type Accessor, createEffect, onCleanup, mergeProps } from 'solid-js'

const focusableElementSelector =
  'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

const EVENT_INITIAL_FOCUS = 'focusTrap.initialFocus'
const EVENT_FINAL_FOCUS = 'focusTrap.finalFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/** Traps focus inside the given element. */
const createFocusTrap = (props: {
  /** Element to trap focus in. */
  element: Accessor<HTMLElement | null>
  /** If the focus trap is enabled.
   * @defaultValue `true`
   */
  enabled?: MaybeAccessor<boolean>
  /** The element to receive focus when the focus trap is activated.
   * @defaultValue The first focusable element inside `element`
   */
  initialFocusElement?: MaybeAccessor<HTMLElement | null>
  /** If the focus should be restored to the element the focus was on initially when the focus trap is deactivated.
   * @defaultValue `true`
   */
  restoreFocus?: MaybeAccessor<boolean>
  /** The element to receive focus when the focus trap is deactivated (`enabled` = `false`).
   * @defaultValue The element the focus was on initially
   */
  finalFocusElement?: MaybeAccessor<HTMLElement | null>
  /** Callback fired when focus moves inside the focus trap. Can be prevented by calling `event.preventDefault`. */
  onInitialFocus?: (event: Event) => void
  /** Callback fired when focus moves outside the focus trap. Can be prevented by calling `event.preventDefault`. */
  onFinalFocus?: (event: Event) => void
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      restoreFocus: true,
    },
    props,
  )

  let firstFocusElement: HTMLElement | null = null
  let lastFocusElement: HTMLElement | null = null

  let originalFocusedElement: HTMLElement | null = null

  createEffect(() => {
    const container = defaultedProps.element()
    if (container && access(defaultedProps.enabled)) {
      const focusableElements = initFocusTrap(container)

      if (firstFocusElement) {
        firstFocusElement.addEventListener(
          'keydown',
          onFirstFocusElementKeyDown,
        )
      }
      if (lastFocusElement) {
        lastFocusElement.addEventListener('keydown', onLastFocusElementKeyDown)
      }
      if (focusableElements.length === 0) {
        ;(document.activeElement as HTMLElement | null)?.blur()
        document.addEventListener('keydown', preventFocus)
      }

      onCleanup(() => {
        if (firstFocusElement) {
          firstFocusElement.removeEventListener(
            'keydown',
            onFirstFocusElementKeyDown,
          )
        }
        if (lastFocusElement) {
          lastFocusElement.removeEventListener(
            'keydown',
            onLastFocusElementKeyDown,
          )
        }
        if (focusableElements.length === 0) {
          document.removeEventListener('keydown', preventFocus)
        }

        restoreFocus(container)
      })
    }
  })

  const initFocusTrap = (container: HTMLElement) => {
    originalFocusedElement = document.activeElement as HTMLElement | null

    const focusableElements = Array.from(
      container.querySelectorAll(focusableElementSelector),
    )
    firstFocusElement = focusableElements[0] as HTMLElement | null
    lastFocusElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement | null

    const initialFocusElement =
      access(defaultedProps.initialFocusElement) ?? firstFocusElement
    const onInitialFocus = defaultedProps.onInitialFocus

    if (!initialFocusElement) {
      return focusableElements
    }

    let event: CustomEvent | undefined
    if (onInitialFocus) {
      event = new CustomEvent(EVENT_INITIAL_FOCUS, EVENT_OPTIONS)
      container.addEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
      container.dispatchEvent(event)
      container.removeEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
    }

    if (event?.defaultPrevented) {
      return focusableElements
    }

    initialFocusElement.focus()

    return focusableElements
  }

  const onFirstFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusElement!.focus()
    }
  }

  const onLastFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusElement!.focus()
    }
  }

  const preventFocus = (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault()
    }
  }

  const restoreFocus = (container: HTMLElement) => {
    const restoreFocus = access(defaultedProps.restoreFocus)
    if (!restoreFocus) return

    const finalFocusElement =
      access(defaultedProps.finalFocusElement) ?? originalFocusedElement

    if (!finalFocusElement) {
      return
    }

    let event: CustomEvent | undefined
    const onFinalFocus = defaultedProps.onFinalFocus
    if (onFinalFocus) {
      event = new CustomEvent(EVENT_FINAL_FOCUS, EVENT_OPTIONS)
      container.addEventListener(EVENT_FINAL_FOCUS, onFinalFocus)
      container.dispatchEvent(event)
      container.removeEventListener(EVENT_FINAL_FOCUS, onFinalFocus)
    }

    if (event?.defaultPrevented) {
      return
    }

    sleep(0).then(() => finalFocusElement.focus())
  }
}

export default createFocusTrap
