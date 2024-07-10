import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable list.
 *
 * @param props.itemCount The number of items in the list.
 * @param props.initialSelected The index of the initially selected item. *Default = `null`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.onSelectedChange Callback fired when the selected index changes.
 * @returns ```typescript
 * {
 *   selected: () => number | null
 *   setSelected: Set<number | null>
 *   onKeyDown: (event: KeyboardEvent) => void
 *   onFocus: (index: number) => void
 * }
 * ```
 */
const createList = (props: {
  itemCount: MaybeAccessor<number>
  initialSelected?: number | null
  orientation?: MaybeAccessor<'vertical' | 'horizontal'>
  loop?: MaybeAccessor<boolean>
  textDirection?: MaybeAccessor<'ltr' | 'rtl'>
  handleTab?: MaybeAccessor<boolean>
  onSelectedChange?: (selected: number | null) => void
}) => {
  const defaultedProps = mergeProps(
    {
      initialSelected: null,
      orientation: 'vertical' as const,
      loop: true,
      textDirection: 'ltr' as const,
      handleTab: true,
    },
    props,
  )

  const [selected, setSelected] = createControllableSignal<number | null>({
    initialValue: defaultedProps.initialSelected,
    onChange: defaultedProps.onSelectedChange,
  })

  const onKeyDown = (event: KeyboardEvent) => {
    const _itemCount = access(defaultedProps.itemCount)
    if (_itemCount < 2) return

    const _selected = selected()
    const _textDirection = access(defaultedProps.textDirection)

    if (
      getNextKey(access(defaultedProps.orientation), _textDirection) ===
      event.key
    ) {
      event.preventDefault()
      if (selected() === _itemCount - 1) {
        if (access(defaultedProps.loop)) {
          setSelected(0)
        }
      } else {
        setSelected(_selected !== null ? _selected + 1 : 0)
      }
    } else if (
      getPreviousKey(access(defaultedProps.orientation), _textDirection) ===
      event.key
    ) {
      event.preventDefault()
      if (_selected === 0) {
        if (access(defaultedProps.loop)) {
          setSelected(_itemCount - 1)
        }
      } else {
        setSelected(_selected !== null ? _selected - 1 : _itemCount - 1)
      }
    } else if (event.key === 'Home') {
      event.preventDefault()
      setSelected(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setSelected(_itemCount - 1)
    } else if (access(defaultedProps.handleTab) && _selected !== null) {
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        _selected < _itemCount - 1
      ) {
        event.preventDefault()
        setSelected(_selected + 1)
      }
      if (event.key === 'Tab' && event.shiftKey && _selected > 0) {
        event.preventDefault()
        setSelected(_selected - 1)
      }
    }
  }

  const onFocus = (index: number) => {
    setSelected(index)
  }

  return { selected, setSelected, onKeyDown, onFocus }
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

export default createList
