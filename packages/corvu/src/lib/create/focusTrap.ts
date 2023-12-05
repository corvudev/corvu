import { MaybeAccessor } from '@lib/types'
import { access, sleep } from '@lib/utils'
import {
  createSignal,
  type Accessor,
  createEffect,
  onCleanup,
  untrack,
  mergeProps,
} from 'solid-js'

const focusableElementSelector =
  'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

const EVENT_INITIAL_FOCUS = 'focusTrap.initialFocus'
const EVENT_FINAL_FOCUS = 'focusTrap.finalFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/** Traps focus inside the given element */
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

  const [firstFocusElement, setFirstFocusElement] =
    createSignal<HTMLElement | null>(null)
  const [lastFocusElement, setLastFocusElement] =
    createSignal<HTMLElement | null>(null)

  let originalFocusedElement: HTMLElement | null = null

  createEffect(() => {
    const container = defaultedProps.element()
    if (container && access(defaultedProps.enabled)) {
      const [_firstFocusElement, _lastFocusElement] = untrack(() => {
        scanElements(container)

        const _firstFocusElement = firstFocusElement()
        const _lastFocusElement = lastFocusElement()

        if (_firstFocusElement) {
          _firstFocusElement.addEventListener(
            'keydown',
            onFirstFocusElementKeyDown,
          )
        }
        if (_lastFocusElement) {
          _lastFocusElement.addEventListener(
            'keydown',
            onLastFocusElementKeyDown,
          )
        }

        return [_firstFocusElement, _lastFocusElement]
      })

      onCleanup(() => {
        restoreFocus(container)

        if (_firstFocusElement) {
          _firstFocusElement.removeEventListener(
            'keydown',
            onFirstFocusElementKeyDown,
          )
        }
        if (_lastFocusElement) {
          _lastFocusElement.removeEventListener(
            'keydown',
            onLastFocusElementKeyDown,
          )
        }
      })
    }
  })

  const scanElements = (container: HTMLElement) => {
    const focusableElements = Array.from(
      container.querySelectorAll(focusableElementSelector),
    )

    setFirstFocusElement((focusableElements[0] as HTMLElement) ?? null)
    setLastFocusElement(
      (focusableElements[focusableElements.length - 1] as HTMLElement) ?? null,
    )

    originalFocusedElement = document.activeElement as HTMLElement | null
    const initialFocusElement = access(defaultedProps.initialFocusElement)
    const _firstFocusElement = firstFocusElement()
    const onInitialFocus = defaultedProps.onInitialFocus

    let event: CustomEvent | undefined
    if ((initialFocusElement || _firstFocusElement) && onInitialFocus) {
      event = new CustomEvent(EVENT_INITIAL_FOCUS, EVENT_OPTIONS)
      container.addEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
      container.dispatchEvent(event)
      container.removeEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
    }

    if (event?.defaultPrevented) {
      return
    }

    if (initialFocusElement) {
      initialFocusElement.focus()
    } else {
      firstFocusElement()?.focus()
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

  const restoreFocus = (container: HTMLElement) => {
    const restoreFocus = access(defaultedProps.restoreFocus)
    if (!restoreFocus) return

    const finalFocusElement = access(defaultedProps.finalFocusElement)

    if (!finalFocusElement && !originalFocusedElement) {
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

    sleep(0).then(() =>
      finalFocusElement
        ? finalFocusElement.focus()
        : originalFocusedElement?.focus(),
    )
  }
}

export default createFocusTrap
