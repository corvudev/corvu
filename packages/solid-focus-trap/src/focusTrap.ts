import { access, afterPaint, type MaybeAccessor } from '@corvu/utils'
import {
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  untrack,
} from 'solid-js'

const focusableElementSelector =
  'a[href]:not([tabindex="-1"]), button:not([tabindex="-1"]), input:not([tabindex="-1"]), textarea:not([tabindex="-1"]), select:not([tabindex="-1"]), details:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'

const EVENT_INITIAL_FOCUS = 'focusTrap.initialFocus'
const EVENT_FINAL_FOCUS = 'focusTrap.finalFocus'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

/**
 * Traps focus inside the given element. Is aware of changes being made to the DOM tree inside the focus trap by using a `MutationObserver`.
 *
 * @param props.element - Element to trap focus in.
 * @param props.enabled - If the focus trap is enabled. *Default = `true`*
 * @param props.observeChanges - Whether to watch for changes being made to the DOM tree inside the focus trap and reload the focus trap accordingly. *Default = `true`*
 * @param props.initialFocusElement - The element to receive focus when the focus trap is activated. *Default = The first focusable element inside `element`*
 * @param props.restoreFocus - If the focus should be restored to the element the focus was on initially when the focus trap is deactivated. *Default = `true`*
 * @param props.finalFocusElement - The element to receive focus when the focus trap is deactivated (`enabled` = `false`). *Default = The element the focus was on initially*
 * @param props.onInitialFocus - Callback fired when focus moves inside the focus trap. Can be prevented by calling `event.preventDefault`.
 * @param props.onFinalFocus - Callback fired when focus moves outside the focus trap. Can be prevented by calling `event.preventDefault`.
 */
const createFocusTrap = (props: {
  element: MaybeAccessor<HTMLElement | null>
  enabled?: MaybeAccessor<boolean>
  observeChanges?: MaybeAccessor<boolean>
  initialFocusElement?: MaybeAccessor<HTMLElement | null>
  restoreFocus?: MaybeAccessor<boolean>
  finalFocusElement?: MaybeAccessor<HTMLElement | null>
  onInitialFocus?: (event: Event) => void
  onFinalFocus?: (event: Event) => void
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      observeChanges: true,
      restoreFocus: true,
    },
    props,
  )

  const [focusableElements, setFocusableElements] = createSignal<
    HTMLElement[] | null
  >(null)
  const firstFocusElement = createMemo(() => {
    const _focusableElements = focusableElements()
    if (!_focusableElements) return null
    return _focusableElements[0] ?? null
  })
  const lastFocusElement = createMemo(() => {
    const _focusableElements = focusableElements()
    if (!_focusableElements) return null
    return _focusableElements[_focusableElements.length - 1] ?? null
  })

  let originalFocusedElement: HTMLElement | null = null

  const mutationObserverCallback = () => {
    loadFocusTrap(access(defaultedProps.element)!)
    if (
      document.activeElement === null ||
      document.activeElement === document.body
    ) {
      initialFocus(access(defaultedProps.element)!)
    }
  }

  createEffect(() => {
    const container = access(defaultedProps.element)
    if (container && access(defaultedProps.enabled)) {
      originalFocusedElement = document.activeElement as HTMLElement | null

      untrack(() => {
        loadFocusTrap(container)
        initialFocus(container)
      })

      const observer = new MutationObserver(mutationObserverCallback)
      if (access(defaultedProps.observeChanges)) {
        observer.observe(container, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['tabindex'],
        })
      }

      onCleanup(() => {
        if (access(defaultedProps.observeChanges)) {
          observer.disconnect()
        }
        setFocusableElements(null)
        restoreFocus(container)
      })
    }
  })

  createEffect(() => {
    const _focusableElements = focusableElements()
    if (_focusableElements === null || _focusableElements.length !== 0) return

    document.addEventListener('keydown', preventFocusChange)
    onCleanup(() => {
      document.removeEventListener('keydown', preventFocusChange)
    })
  })

  createEffect(() => {
    const _firstFocusElement = firstFocusElement()
    if (!_firstFocusElement) return

    _firstFocusElement.addEventListener('keydown', onFirstFocusElementKeyDown)
    onCleanup(() => {
      _firstFocusElement.removeEventListener(
        'keydown',
        onFirstFocusElementKeyDown,
      )
    })
  })

  createEffect(() => {
    const _lastFocusElement = lastFocusElement()
    if (!_lastFocusElement) return

    _lastFocusElement.addEventListener('keydown', onLastFocusElementKeyDown)
    onCleanup(() => {
      _lastFocusElement.removeEventListener(
        'keydown',
        onLastFocusElementKeyDown,
      )
    })
  })

  const loadFocusTrap = (container: HTMLElement) => {
    setFocusableElements(
      Array.from(
        container.querySelectorAll(focusableElementSelector),
      ) as HTMLElement[],
    )
  }

  const initialFocus = (container: HTMLElement) => {
    const initialFocusElement =
      access(defaultedProps.initialFocusElement) ??
      firstFocusElement() ??
      container
    const onInitialFocus = defaultedProps.onInitialFocus

    let event: CustomEvent | undefined
    if (onInitialFocus) {
      event = new CustomEvent(EVENT_INITIAL_FOCUS, EVENT_OPTIONS)
      container.addEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
      container.dispatchEvent(event)
      container.removeEventListener(EVENT_INITIAL_FOCUS, onInitialFocus)
    }

    if (event?.defaultPrevented === true) {
      return
    }

    afterPaint(() => initialFocusElement.focus())
  }

  const onFirstFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      lastFocusElement()!.focus()
    }
  }

  const onLastFocusElementKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      firstFocusElement()!.focus()
    }
  }

  const preventFocusChange = (event: KeyboardEvent) => {
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

    if (event?.defaultPrevented === true) {
      return
    }

    afterPaint(() => finalFocusElement.focus())
  }
}

export default createFocusTrap
