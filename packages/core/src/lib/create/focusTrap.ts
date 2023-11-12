import { MaybeAccessor } from '@lib/types'
import { access, sleep } from '@lib/utils'
import {
  createSignal,
  type Accessor,
  createEffect,
  onCleanup,
  untrack,
} from 'solid-js'

const focusableElementSelector =
  'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

const EVENT_INITIAL_FOCUS = 'focusTrap.initialFocus'
const EVENT_FINAL_FOCUS = 'focusTrap.finalFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

const createFocusTrap = (props: {
  element: Accessor<HTMLElement | null>
  initialFocusElement?: MaybeAccessor<HTMLElement | null>
  isDisabled?: MaybeAccessor<boolean>
  restoreFocus?: MaybeAccessor<boolean>
  finalFocusElement?: MaybeAccessor<HTMLElement | null>
  onInitialFocus?: (event: Event) => void
  onFinalFocus?: (event: Event) => void
}) => {
  const [firstFocusElement, setFirstFocusElement] =
    createSignal<HTMLElement | null>(null)
  const [lastFocusElement, setLastFocusElement] =
    createSignal<HTMLElement | null>(null)

  let originalFocusedElement: HTMLElement | null = null

  createEffect(() => {
    const container = props.element()
    if (container && !access(props.isDisabled)) {
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
    const initialFocusElement = access(props.initialFocusElement)
    const _firstFocusElement = firstFocusElement()
    const onInitialFocus = props.onInitialFocus

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
    const restoreFocus = access(props.restoreFocus)
    if (!restoreFocus) return

    const finalFocusElement = access(props.finalFocusElement)

    if (!finalFocusElement && !originalFocusedElement) {
      return
    }

    let event: CustomEvent | undefined
    const onFinalFocus = props.onFinalFocus
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
