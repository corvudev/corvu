import {
  afterPaint,
  callEventHandler,
  combineStyle,
  type ElementOf,
  type Ref,
} from '@corvu/utils/dom'
import {
  createEffect,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import createOtpFieldStyleElement from '@src/lib/style'
import { isServer } from '@solidjs/web'
import { mergeRefs } from '@corvu/utils/reactivity'
import { useInternalOtpFieldContext } from '@src/context'

export type OtpFieldInputCorvuProps = {
  /**
   * Regex pattern for the input. `null` disables the pattern and allow all chars.
   * @defaultValue `'^\\d*$'`
   */
  pattern?: string | null
  /** Override the styles to apply when JavaScript is disabled. corvu provides a default for this but you're free to define your own styling. `null` disables the fallback. */
  noScriptCSSFallback?: string | null
  /**
   * The `id` of the OTP Field context. Useful if you have nested OTP Fields and want to create components that belong to an OTP Field higher up in the tree.
   */
  contextId?: string
}

export type OtpFieldInputSharedElementProps<
  T extends ValidComponent = 'input',
> = {
  ref: Ref<ElementOf<T>>
  onInput: JSX.EventHandlerUnion<ElementOf<T>, InputEvent>
  onFocus: JSX.EventHandlerUnion<ElementOf<T>, FocusEvent>
  onBlur: JSX.EventHandlerUnion<ElementOf<T>, FocusEvent>
  onMouseOver: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
  onMouseLeave: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
  onKeyDown: JSX.EventHandlerUnion<ElementOf<T>, KeyboardEvent>
  onKeyUp: JSX.EventHandlerUnion<ElementOf<T>, KeyboardEvent>
  inputMode: string
  autocomplete: string | undefined
  disabled: boolean | undefined
  spellcheck: boolean | undefined
  style: string | JSX.CSSProperties
}

export type OtpFieldInputElementProps = OtpFieldInputSharedElementProps & {
  pattern: string | undefined
  'data-corvu-otp-field-input': '' | null
}

export type OtpFieldInputProps<T extends ValidComponent = 'input'> =
  OtpFieldInputCorvuProps & Partial<OtpFieldInputSharedElementProps<T>>

/** The hidden input element for the OTP Field.
 *
 * @data `data-corvu-otp-field-input` - Present on every OTP Field input element.
 */
const OtpFieldInput = <T extends ValidComponent = 'input'>(
  props: DynamicProps<T, OtpFieldInputProps<T>>,
) => {
  const defaultedProps = mergeProps(
    {
      pattern: '^\\d*$',
      noScriptCSSFallback: DEFAULT_NOSCRIPT_CSS_FALLBACK,
    },
    props as OtpFieldInputProps,
  )
  const [localProps, otherProps] = splitProps(defaultedProps, [
    'pattern',
    'noScriptCSSFallback',
    'ref',
    'onInput',
    'onFocus',
    'onBlur',
    'onMouseOver',
    'onMouseLeave',
    'onKeyDown',
    'onKeyUp',
    'autocomplete',
    'disabled',
    'spellcheck',
    'style',
    'contextId',
  ])

  const previousSelection: {
    inserting: boolean
    start: number | null
    end: number | null
  } = {
    inserting: false,
    start: null,
    end: null,
  }
  let shiftKeyDown = false

  const [ref, setRef] = createSignal<HTMLInputElement | null>(null)

  const context = createMemo(() =>
    useInternalOtpFieldContext(localProps.contextId),
  )

  createEffect(() => {
    createOtpFieldStyleElement()
    const onSelectionChangeWrapper = () => onSelectionChange()
    document.addEventListener('selectionchange', onSelectionChangeWrapper)
    onCleanup(() => {
      document.removeEventListener('selectionchange', onSelectionChangeWrapper)
    })
  })

  createEffect(() => {
    const element = ref()
    if (!element) return
    const form = element.form
    if (!form) return
    const onReset = () => {
      afterPaint(() => {
        context().setValue(element.value)
      })
    }
    form.addEventListener('reset', onReset)
    onCleanup(() => {
      form.removeEventListener('reset', onReset)
    })
  })

  createEffect(() => {
    const element = ref()
    if (!element) return

    element.value = context().value()
  })

  const patternRegex = createMemo(() =>
    localProps.pattern !== null ? new RegExp(localProps.pattern) : undefined,
  )

  const onInput: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onInput, event)) return

    const rawValue = event.currentTarget.value
    let finalValue = rawValue
    const contextValue = context().value()
    const selectionSize = Math.abs(
      (previousSelection.start ?? 0) - (previousSelection.end ?? 0),
    )
    const regex = patternRegex()

    if (
      (previousSelection.inserting || selectionSize === contextValue.length) &&
      regex
    ) {
      finalValue = finalValue.replace(new RegExp(`[^${regex.source}]`, 'g'), '')
    }
    finalValue = finalValue.slice(0, context().maxLength())

    const hasInvalidChars = !!regex && !regex.test(finalValue)
    if (
      (rawValue.length !== 0 && finalValue.length === 0) ||
      finalValue === contextValue ||
      hasInvalidChars
    ) {
      event.preventDefault()
      event.currentTarget.value = contextValue
      if (hasInvalidChars) {
        event.currentTarget.setSelectionRange(
          previousSelection.start ?? 0,
          previousSelection.end ?? 0,
        )
      }
      return
    }

    if (finalValue.length < contextValue.length) {
      onSelectionChange(event.inputType)
    }

    context().setValue(finalValue)
  }

  const onFocus: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onFocus, event)) return
    event.currentTarget.setSelectionRange(
      context().value().length,
      context().value().length,
    )
    context().setIsFocused(true)
    onSelectionChange()
  }

  const onBlur: JSX.EventHandlerUnion<HTMLInputElement, FocusEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onBlur, event)) return
    shiftKeyDown = false
    context().setIsFocused(false)
    onSelectionChange()
  }

  const onMouseOver: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
    event,
  ) => {
    !callEventHandler(localProps.onMouseOver, event) &&
      localProps.disabled !== true &&
      context().setIsHovered(true)
  }

  const onMouseLeave: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent> = (
    event,
  ) => {
    !callEventHandler(localProps.onMouseLeave, event) &&
      context().setIsHovered(false)
  }

  const onKeyDown: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onKeyDown, event)) return
    if (event.key !== 'Shift') return
    shiftKeyDown = true
  }

  const onKeyUp: JSX.EventHandlerUnion<HTMLInputElement, KeyboardEvent> = (
    event,
  ) => {
    if (callEventHandler(localProps.onKeyUp, event)) return
    if (event.key !== 'Shift') return
    shiftKeyDown = false
  }

  const onSelectionChange = (inputType?: string) => {
    const element = ref()
    if (!element) return
    if (
      context().isFocused() === false ||
      document.activeElement !== element ||
      element.selectionStart === null ||
      element.selectionEnd === null
    ) {
      syncSelection({
        start: null,
        end: null,
        inserting: false,
        originalStart: element.selectionStart,
        originalEnd: element.selectionEnd,
      })
      context().setIsInserting(false)
      return
    }
    const maxLength = context().maxLength()
    const inserting =
      element.value.length < maxLength &&
      element.selectionStart === element.value.length
    context().setIsInserting(inserting)

    if (inserting || element.selectionStart !== element.selectionEnd) {
      syncSelection({
        start: element.selectionStart,
        end: inserting ? element.selectionEnd + 1 : element.selectionEnd,
        inserting: inserting,
        originalStart: element.selectionStart,
        originalEnd: element.selectionEnd,
      })
      return
    }

    let selectionStart = 0
    let selectionEnd = 0
    let direction: 'forward' | 'backward' | undefined = undefined
    if (element.selectionStart === 0) {
      selectionStart = 0
      selectionEnd = 1
      direction = 'forward'
    } else if (element.selectionStart === maxLength) {
      selectionStart = maxLength - 1
      selectionEnd = maxLength
      direction = 'backward'
    } else {
      let startOffset = 0
      let endOffset = 1
      if (previousSelection.start !== null && previousSelection.end !== null) {
        const navigatedBackwards =
          element.selectionStart < previousSelection.end &&
          Math.abs(previousSelection.start - previousSelection.end) === 1
        direction = navigatedBackwards ? 'backward' : 'forward'
        if (
          (navigatedBackwards &&
            !previousSelection.inserting &&
            inputType !== 'deleteContentForward') ||
          (!navigatedBackwards && shiftKeyDown)
        ) {
          startOffset += -1
        }
      }
      if (shiftKeyDown && inputType === undefined) {
        endOffset += 1
      }
      selectionStart = element.selectionStart + startOffset
      selectionEnd = element.selectionEnd + startOffset + endOffset
    }

    element.setSelectionRange(selectionStart, selectionEnd, direction)
    syncSelection({
      start: selectionStart,
      end: selectionEnd,
      inserting: inserting,
      originalStart: element.selectionStart,
      originalEnd: element.selectionEnd,
    })
  }

  const syncSelection = (props: {
    start: number | null
    end: number | null
    inserting: boolean
    originalStart: number | null
    originalEnd: number | null
  }) => {
    previousSelection.inserting = props.inserting
    previousSelection.start = props.originalStart
    previousSelection.end = props.originalEnd
    const start = props.start
    const end = props.end
    if (start === null || end === null) {
      context().setActiveSlots([])
      return
    }
    const indexes = Array.from({ length: end - start }, (_, i) => start + i)
    context().setActiveSlots(indexes)
  }

  return (
    <>
      <Show when={localProps.noScriptCSSFallback !== null && isServer}>
        <noscript>
          <style>{localProps.noScriptCSSFallback}</style>
        </noscript>
      </Show>
      <Dynamic<OtpFieldInputElementProps>
        as="input"
        // === SharedElementProps ===
        ref={mergeRefs(setRef, localProps.ref)}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        inputMode="numeric"
        autocomplete={localProps.autocomplete ?? 'one-time-code'}
        disabled={localProps.disabled}
        spellcheck={localProps.spellcheck ?? false}
        style={combineStyle(
          {
            display: 'flex',
            position: 'absolute',
            inset: 0,
            width: context().shiftPWManagers() ? 'calc(100% + 40px)' : '100%',
            'clip-path': context().shiftPWManagers()
              ? 'inset(0 40px 0 0)'
              : undefined,
            height: '100%',
            padding: 0,
            color: 'transparent',
            background: 'transparent',
            'caret-color': 'transparent',
            border: '0 solid transparent',
            outline: '0 solid transparent',
            'box-shadow': 'none',
            'line-height': '1',
            'letter-spacing': '-1em',
            'font-family': 'monospace',
            'font-variant-numeric': 'tabular-nums',
            'font-size': `${context().rootHeight()}px`,
            'pointer-events': 'all',
          },
          localProps.style,
        )}
        // === ElementProps ===
        pattern={patternRegex()?.source}
        data-corvu-otp-field-input=""
        {...otherProps}
      />
    </>
  )
}

const DEFAULT_NOSCRIPT_CSS_FALLBACK = `
[data-corvu-otp-field-input] {
  color: black !important;
  background-color: white !important;
  caret-color: black !important;
  letter-spacing: inherit !important;
  text-align: center !important;
  border: 1px solid black !important;
  width: 100% !important;
  font-size: inherit !important;
  clip-path: none !important;
}
`

export default OtpFieldInput
