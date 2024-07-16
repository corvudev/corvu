import {
  type Component,
  createMemo,
  createSignal,
  type JSX,
  mergeProps,
  type Setter,
  untrack,
} from 'solid-js'
import {
  createAccordionContext,
  createInternalAccordionContext,
} from '@src/context'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { createList } from 'solid-list'
import createOnce from '@corvu/utils/create/once'
import { isFunction } from '@corvu/utils'
import { sortByDocumentPosition } from '@corvu/utils/dom'

export type AccordionRootProps = {
  /**
   * Whether multiple accordion items can be expanded at the same time.
   * @defaultValue `false`
   */
  multiple?: boolean
  /**
   * The value of the accordion.
   */
  value?: string | string[] | null
  /**
   * Callback fired when the value changes.
   */
  onValueChange?: (value: string | string[] | null) => void
  /**
   * The value of the accordion initially.
   * @defaultValue `null`
   */
  initialValue?: string | string[] | null
  /**
   * Whether the accordion can be fully collapsed.
   * @defaultValue `true`
   */
  collapsible?: boolean
  /**
   * Whether the accordion is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean
  /**
   * The orientation of the accordion.
   * @defaultValue `vertical`
   */
  orientation?: 'vertical' | 'horizontal'
  /**
   * Whether the accordion should loop when navigating with the keyboard.
   * @defaultValue `true`
   */
  loop?: boolean
  /**
   * The text direction of the accordion.
   * @defaultValue `ltr`
   */
  textDirection?: 'ltr' | 'rtl'
  /**
   * Whether the accordion content should be removed or hidden when collapsed. Useful if you want to always render the content for SEO reasons.
   * @defaultValue `remove`
   */
  collapseBehavior?: 'remove' | 'hide'
  /**
   * The `id` of the accordion context. Useful if you have nested accordions and want to create components that belong to a accordion higher up in the tree.
   */
  contextId?: string
  /** @hidden */
  children: JSX.Element | ((props: AccordionRootChildrenProps) => JSX.Element)
}

/** Props that are passed to the Root component children callback. */
export type AccordionRootChildrenProps = {
  /** Whether multiple accordion items can be expanded at the same time. */
  multiple: boolean
  /** The value of the accordion. */
  value: string | string[] | null
  /** Callback fired when the value changes. */
  setValue: Setter<string | string[] | null>
  /** Whether the accordion can be fully collapsed. */
  collapsible: boolean
  /** Whether the accordion is disabled. */
  disabled: boolean
  /** The orientation of the accordion. */
  orientation: 'horizontal' | 'vertical'
  /** Whether the accordion should loop when navigating with the keyboard. */
  loop: boolean
  /** The text direction of the accordion. */
  textDirection: 'ltr' | 'rtl'
  /** Whether the accordion content should be removed or hidden when collapsed. */
  collapseBehavior: 'remove' | 'hide'
}

/** Context wrapper for the accordion. Is required for every accordion you create. */
const AccordionRoot: Component<AccordionRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      multiple: false,
      initialValue: null,
      collapsible: true,
      disabled: false,
      orientation: 'vertical' as const,
      loop: true,
      textDirection: 'ltr' as const,
      collapseBehavior: 'remove' as const,
    },
    props,
  )

  const [value, setValue] = createControllableSignal({
    value: () => defaultedProps.value,
    initialValue: defaultedProps.initialValue,
    onChange: defaultedProps.onValueChange,
  })

  const internalValue = createMemo(() => {
    const _value = value()
    if (_value === null) {
      return []
    }
    if (!Array.isArray(_value)) {
      return [_value]
    }
    return _value
  })

  const toggleValue = (value: string) => {
    const _internalValue = internalValue()
    if (!defaultedProps.multiple) {
      if (_internalValue.includes(value)) {
        if (!defaultedProps.collapsible) return
        setValue(null)
      } else {
        setValue(value)
      }
      return
    } else {
      if (_internalValue.includes(value)) {
        if (_internalValue.length === 1 && !defaultedProps.collapsible) return
        setValue(_internalValue.filter((v) => v !== value))
      } else {
        setValue([..._internalValue, value])
      }
    }
  }

  const [triggers, setTriggers] = createSignal<HTMLElement[]>([])
  const selectableTriggers = createMemo(() => {
    return triggers()
      .filter((element) => !element.hasAttribute('disabled'))
      .sort(sortByDocumentPosition)
  })

  const { setActive, onKeyDown: onTriggerKeyDown } = createList({
    itemCount: () => selectableTriggers().length,
    orientation: () => defaultedProps.orientation,
    loop: () => defaultedProps.loop,
    textDirection: () => defaultedProps.textDirection,
    onActiveChange: (index) => {
      if (index === null) return
      const trigger = selectableTriggers()[index]
      if (!trigger) return
      trigger.focus()
    },
  })

  const childrenProps: AccordionRootChildrenProps = {
    get multiple() {
      return defaultedProps.multiple
    },
    get value() {
      return value()
    },
    setValue,
    get collapsible() {
      return defaultedProps.collapsible
    },
    get disabled() {
      return defaultedProps.disabled
    },
    get orientation() {
      return defaultedProps.orientation
    },
    get loop() {
      return defaultedProps.loop
    },
    get textDirection() {
      return defaultedProps.textDirection
    },
    get collapseBehavior() {
      return defaultedProps.collapseBehavior
    },
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  const memoizedAccordionRoot = createMemo(() => {
    const AccordionContext = createAccordionContext(defaultedProps.contextId)
    const InternalAccordionContext = createInternalAccordionContext(
      defaultedProps.contextId,
    )

    return (
      <AccordionContext.Provider
        value={{
          multiple: () => defaultedProps.multiple,
          value,
          setValue,
          collapsible: () => defaultedProps.collapsible,
          disabled: () => defaultedProps.disabled,
          orientation: () => defaultedProps.orientation,
          loop: () => defaultedProps.loop,
          textDirection: () => defaultedProps.textDirection,
          collapseBehavior: () => defaultedProps.collapseBehavior,
        }}
      >
        <InternalAccordionContext.Provider
          value={{
            multiple: () => defaultedProps.multiple,
            value,
            setValue,
            collapsible: () => defaultedProps.collapsible,
            disabled: () => defaultedProps.disabled,
            orientation: () => defaultedProps.orientation,
            loop: () => defaultedProps.loop,
            textDirection: () => defaultedProps.textDirection,
            collapseBehavior: () => defaultedProps.collapseBehavior,
            internalValue,
            toggleValue,
            registerTrigger: (trigger) =>
              setTriggers((triggers) => [...triggers, trigger]),
            unregisterTrigger: (trigger) =>
              setTriggers((triggers) => triggers.filter((t) => t !== trigger)),
            onTriggerKeyDown,
            onTriggerFocus: (e) =>
              setActive(selectableTriggers().indexOf(e.target as HTMLElement)),
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalAccordionContext.Provider>
      </AccordionContext.Provider>
    )
  })

  return memoizedAccordionRoot as unknown as JSX.Element
}

export default AccordionRoot
